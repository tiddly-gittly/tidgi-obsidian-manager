/*\
title: $:/plugins/whitefall/obsidian-manager/router/get-obstore.js
type: application/javascript
module-type: route

GET obstore/:filepath

suppliedFilename = :filepath

// extension = path.extname(filename);

request：obstore/D:/Dropbox/21-Sandox/10-Picture/wine.png?key1=value1&key2=value2
response：返回obstore找到的所有文件数据。

state.queryParameters: { key1: 'value1', key2: 'value2' }
Query String Parameters当发起一次GET请求时，参数会以url string的形式进行传递。即?后的字符串则为其请求参数，并以&作为分隔符。

最难的两个问题，嵌套的回调函数中的结果向最外层函数传递、递归调用返回结果。

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
            suppliedPath = $tw.utils.decodeURIComponentSafe(state.params[0]);

        /**
        * @function 获取路径下的所有文件路径，返回一个列表。
        * @description any
        * @param suppliedPath 路径文件夹
        * @param ignore 忽略的文件夹
        * @return [] or false
        * @author WhiteFall 2023/06/24
        */
        var catalogs = function (suppliedPath, ignore) {
            var ignore = ignore || [".git", ".obsidian"];
            var result = [];
            var stat = fs.lstatSync(suppliedPath);
            if (stat.isDirectory()) {
                const files = fs.readdirSync(suppliedPath);
                for (const item of files) {
                    const filePath = path.join(suppliedPath, item);
                    var data = fs.statSync(filePath);
                    if (data.isFile()) {
                        result.push(filePath);
                    } else if (!ignore.includes(item)) {
                        // 排除不需要的目录。
                        // 可能需要更高级的形式。
                        const fileResult = catalogs(filePath);
                        result = result.concat(fileResult);
                    }
                }
            } else {
                state.sendResponse(400, { "Content-Type": "text/plain" }, "Not folder: " + suppliedPath);
                return false;
            }
            return result;
        }

        // 通过已知文件路径获取文件数据，并对文件数据结构化后返回。
        // regText : def:pub
        /**
        * @function 从给定文件路径数组中读取文件数据，返回字典数据。
        * @param filesPathList 文件路径数组
        * @param regText 筛选文件正则表达式。
        * @return dict.
        * @author WhiteFall 2023/06/24
        */
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
        // 即使options.ignore的值是字符串，但使用options.ignore调用后就会变成[]类型。
        console.log("options.ignore :: ", options.ignore);
        const result = catalogs(suppliedPath, options.ignore);
        // readFilesFormList(result, "def:pub") 过滤符合特征的md文件。
        if (result != false) {
            const data = readFilesFormList(result, options.regText);
            const content = JSON.stringify(data);
            // Send the file
            state.sendResponse(200, { "Content-Type": "application/json" }, content);
        }
    };
}());