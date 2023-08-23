/*\
title: $:/plugins/whitefall/obsidian-vault/router/get-obvault.js
type: application/javascript
module-type: route

GET obvault/:filepath

request：obvault/D:/Dropbox/21-Sandox/10-Picture/wine.png?key1=value1&key2=value2
response：返回obvault找到的所有文件数据。

Query String Parameters当发起一次GET请求时，参数会以url string的形式进行传递。即?后的字符串则为其请求参数，并以&作为分隔符。
state.queryParameters: { key1: 'value1', key2: 'value2' }

最难的两个问题，嵌套的回调函数中的结果向最外层函数传递、递归调用返回结果。

\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    exports.method = "GET";

    exports.path = /^\/obvault\/(.+)$/;
    exports.handler = function (request, response, state) {

        var path = require("path"),
            fs = require("fs"),
            suppliedPath = $tw.utils.decodeURIComponentSafe(state.params[0]),
            options = state.queryParameters;

        /**
        * 获取路径下的所有文件路径，返回一个列表。
        * @param suppliedPath 路径文件夹
        * @param ignore 忽略的文件夹
        * @return [] or false
        * @author WhiteFall 2023-7-26
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

        /**
        * @function 从给定文件路径数组中读取文件数据，返回字典数据。
        * @param ListfilesPath 文件路径数组
        * @param regText 筛选文件正则表达式。
        * @return 数据字典 { mdFiles: {}, imgFiles: {} }
        * @author WhiteFall 2023-7-26
        */
        var readFilesFormList = function (ListfilesPath, regText) {
            var textData,
                folderName = suppliedPath.split('/').pop() || "-", // C:/Users/Documents/vault
                obvaultdata = { obVaultName: folderName, mdFiles: {}, imgFiles: {} },
                basename,
                extension,
                regMdFileText = regText || '';
            ListfilesPath.forEach(file => {
                basename = path.basename(file);
                extension = path.extname(basename);
                // Set(basename:[{path,data}])
                if (['.jpg', '.jpeg', '.png'].indexOf(extension) !== -1) {
                    if (obvaultdata.imgFiles[basename]) {
                        obvaultdata.imgFiles[basename].push({ path: getRelativePath(suppliedPath, file), data: fs.readFileSync(file).toString('base64') })
                    } else {
                        // 将二进制数据转换成base64编码
                        obvaultdata.imgFiles[basename] = [{ path: getRelativePath(suppliedPath, file), data: fs.readFileSync(file).toString('base64') }];
                    }
                } else if (extension === '.md') {
                    textData = fs.readFileSync(file, 'utf8');
                    var reg = RegExp(regMdFileText);
                    if (reg.test(textData)) {
                        if (obvaultdata.mdFiles[basename]) {
                            obvaultdata.mdFiles[basename].push({ path: getRelativePath(suppliedPath, file), data: textData });
                        } else {
                            obvaultdata.mdFiles[basename] = [{ path: getRelativePath(suppliedPath, file), data: textData }];
                        }
                    }
                }
            });
            return obvaultdata
        }

        var getRelativePath = function (sourcePath, targetPath) {
            sourcePath = sourcePath.replace(/\\/g, '/'); //C:/Users/Snowy/Desktop/vault
            targetPath = targetPath.replace(/\\/g, '/'); //C:\Users\Snowy\Desktop\vault\⭐健康.md
            return targetPath.slice(sourcePath.length + 1);
        }

        // Main
        // 即使options.ignore的值是字符串，但使用options.ignore调用后就会变成[]类型。
        const result = catalogs(suppliedPath, options.ignore);
        if (result != false) {
            const data = readFilesFormList(result, options.regText);
            const content = JSON.stringify(data);
            // Send the file
            state.sendResponse(200, { "Content-Type": "application/json" }, content);
        }
    };
}());