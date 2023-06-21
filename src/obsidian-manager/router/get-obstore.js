/*\
title: $:/plugins/whitefall/obsidian-manager/router/get-obstore.js
type: application/javascript
module-type: route

GET /obstore/:filepath

suppliedFilename = :filepath

request：/obstore/D:/Dropbox/21-Sandox/10-Picture/wine.png?key1=value1&key2=value2
response：返回obstore找到的所有文件数据。

state.queryParameters: { key1: 'value1', key2: 'value2' }
Query String Parameters当发起一次GET请求时，参数会以url string的形式进行传递。即?后的字符串则为其请求参数，并以&作为分隔符。

\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    exports.method = "GET";

    exports.path = /^\/obstore\/(.+)$/;
    exports.handler = function (request, response, state) {

        var path = require("path"),
            fs = require("fs"),
            options = state.queryParameters,
            suppliedFilename = $tw.utils.decodeURIComponentSafe(state.params[0]);
        // extension = path.extname(filename);
        // 最难的两个问题，嵌套的回调函数中的结果向最外层函数传递、递归调用返回结果。
        console.log(options);
        var catalogs = function (suppliedFilename, ignore) {
            var ignore = ignore || [".git", ".obsidian"];
            var result = [];
            const files = fs.readdirSync(suppliedFilename);
            for (const item of files) {
                const filePath = path.join(suppliedFilename, item);
                var data = fs.statSync(filePath);
                if (data.isFile()) {
                    result.push(filePath);
                } else if (!ignore.includes(item)) {
                    // 排除不需要的目录。
                    const fileResult = catalogs(filePath);
                    result = result.concat(fileResult);
                }
            }
            return result;
        }

        // 通过已知文件路径获取文件数据，并对文件数据结构化后返回。
        // regText : def:pub
        var readFilesFormList = function (filesPathList, regText) {
            var fileData,
                imageData,
                basename,
                ext,
                regMdFileText = regText || '',
                obStoreData = {
                    md: {},
                    image: {}
                };
            filesPathList.forEach(file => {
                basename = path.basename(file);
                ext = path.extname(basename);
                if (['.jpg', '.jpeg', '.png'].indexOf(ext) !== -1) {
                    // 将二进制数据转换成base64编码
                    imageData = fs.readFileSync(file);
                    obStoreData.image[basename] = imageData.toString('base64');
                } else if (ext === '.md') {
                    fileData = fs.readFileSync(file, 'utf8');
                    var reg = RegExp(regMdFileText);
                    if (reg.test(fileData)) {
                        obStoreData.md[basename] = fileData;
                    }
                }
            });
            return obStoreData
        }

        const result = catalogs(suppliedFilename, [".git", ".obsidian", "绘图"]);
        // readFilesFormList(result, "def:pub") 过滤符合特征的md文件。
        const data = readFilesFormList(result, options.regText);
        const content = JSON.stringify(data);
        // Send the file
        state.sendResponse(200, { "Content-Type": "application/json" }, content);
    };
}());