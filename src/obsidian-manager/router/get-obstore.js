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

        // 嵌套回调函数中的变量目前无法回溯到最外层函数使用。
        var catalogs = function (suppliedFilename, ignore) {
            var ignore = ignore || [".git", ".obsidian"];
            return new Promise((resolve, reject) => {
                fs.readdir(suppliedFilename, function (err, files) {
                    var status, content, type = "text/plain";
                    if (err) {
                        reject(err);
                    } else {
                        status = 200;
                        for (let index = 0; index < files.length; index++) {
                            const item = files[index];
                            fs.stat(suppliedFilename + '/' + item, (err, data) => {
                                if (data.isFile()) {
                                    // 加入到文件路径列表。
                                    // resolve();
                                    console.log(suppliedFilename + '/' + item)
                                } else if (!ignore.includes(item)) {
                                    // 排除不需要的目录。
                                    catalogs(suppliedFilename + '/' + item);
                                }
                            });
                        }
                    }
                });
            });
        }

        var readFilesDateFormList = function (files) {
            var date = [];
            files.forEach(f => {
                console.log(f);
                fs.readFile(f, 'utf8', function (err, data) {
                    date.push(data);
                });
            });
            return date
        }

        catalogs(suppliedFilename, [".git", ".obsidian", "绘图"]);
        // Send the file
        // 这里读取文件目录中的所有文件，并返回这些文件内容的格式化数据。
        // state.sendResponse(status, { "Content-Type": type }, content);

    };



}());