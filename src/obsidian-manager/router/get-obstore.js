/*\
title: $:/plugins/whitefall/obsidian-manager/router/get-obstore.js
type: application/javascript
module-type: route

GET /obstore/:filepath

suppliedFilename = :filepath

request：/obstore/D:/Dropbox/21-Sandox/10-Picture/wine.png
response：返回obstore找到的所有文件数据。

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
            util = require("util"),
            suppliedFilename = $tw.utils.decodeURIComponentSafe(state.params[0]);
        // extension = path.extname(filename);
        // 最难的两个问题，嵌套的回调函数中的结果向最外层函数传递、递归调用返回结果。
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
        var readFilesFormList = function (filesPathList) {
            var fileData,
                basename,
                ext,
                obStoreData = {
                    image: {},
                    md: {},
                    list:[]
                };
            filesPathList.forEach(file => {
                basename = path.basename(file);
                ext = path.extname(basename);
                fileData = fs.readFileSync(file, 'utf8');
                if (['.jpg', '.jpeg', '.png'].indexOf(ext) !== -1) {
                    obStoreData.image[basename] = fileData;
                } else if (ext === '.md') {
                    obStoreData.md[basename] = fileData;
                }
                obStoreData.list.push(basename);
            });
            return obStoreData
        }
        
        const result = catalogs(suppliedFilename, [".git", ".obsidian", "绘图"]);
        const data = readFilesFormList(result);
        const content = JSON.stringify(data);
        // Send the file
        state.sendResponse(200, { "Content-Type": "application/json" }, content);
    };
}());