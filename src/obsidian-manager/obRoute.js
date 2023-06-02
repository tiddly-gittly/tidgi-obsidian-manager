/*\
title: title: $:/plugins/whitefall/obsidian-manager/obRoute.js
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
            suppliedFilename = $tw.utils.decodeURIComponentSafe(state.params[0]),
            baseFilename = path.resolve(state.boot.wikiPath, "files"),
            filename = path.resolve(baseFilename, suppliedFilename),
            extension = path.extname(filename);
        console.log(baseFilename);
        // Check that the filename is inside the wiki files folder
        if (path.relative(baseFilename, filename).indexOf("..") !== 0) {
            // Send the file
            fs.readFile(filename, function (err, content) {
                var status, content, type = "text/plain";
                if (err) {
                    console.log("Error accessing file " + filename + ": " + err.toString());
                    status = 404;
                    content = "File '" + suppliedFilename + "' not found";
                } else {
                    status = 200;
                    content = content;
                    type = ($tw.config.fileExtensionInfo[extension] ? $tw.config.fileExtensionInfo[extension].type : "application/octet-stream");
                }
                state.sendResponse(status, { "Content-Type": type }, content);
            });
        } else {
            state.sendResponse(404, { "Content-Type": "text/plain" }, "File '" + suppliedFilename + "' not found");
        }
    };

}());