/*\
title: $:/plugins/mingyue/markdown-vault/router/get-obvault.js
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
        * 获取路径下的所有文件数据，返回obvaultdata。
        * @param suppliedPath 路径文件夹
        * @param regText 正则表达式
        * @param ignore 忽略的文件夹
        * @return obvaultdata or false
        * @author 明玥 2024-1-30
        */
        var catalogs = function (suppliedPath, regText, ignore) {
            var ignore = ignore || [".git", ".obsidian"],
                basename,
                extension,
                folderName = suppliedPath.split('/').pop() || "-", // C:/Users/Documents/vault
                obvaultdata = { obVaultName: folderName, mdFiles: {}, imgFiles: {}, bp_peer: {} },
                regMdFileText = regText || '';
            if (fs.statSync(suppliedPath).isDirectory()) {
                // 必须是一个文件夹库
                let stack = [suppliedPath]
                while (stack.length !== 0) {
                    let curr_path = stack.pop()
                    for (const item_path of fs.readdirSync(curr_path)) {
                        const absPath = path.join(curr_path, item_path)
                        if (fs.statSync(absPath).isFile()) {
                            // 是文件
                            // result.push(filePath);
                            let separate = item_path.lastIndexOf('.')
                            basename = item_path.substring(0, separate);
                            extension = item_path.substring(separate + 1);
                            // Set(basename:[{path,data}])
                            const ext_def = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
                            if (ext_def.indexOf(extension) !== -1) {
                                if (obvaultdata.imgFiles[basename]) {
                                    obvaultdata.imgFiles[basename].push({
                                        path: getRelativePath(suppliedPath, absPath),
                                        data: fs.readFileSync(absPath).toString('base64'),
                                        basename: basename,
                                        extension: extension
                                    })
                                } else {
                                    // 将二进制数据转换成base64编码
                                    obvaultdata.imgFiles[basename] = [
                                        {
                                            path: getRelativePath(suppliedPath, absPath),
                                            data: fs.readFileSync(absPath).toString('base64'),
                                            basename: basename,
                                            extension: extension
                                        }
                                    ];
                                }
                            } else if (extension === 'md') {
                                // console.log(`file:: ${basename}, ${extension}`);
                                let separate = absPath.lastIndexOf('.')
                                let fullpath_basename = absPath.substring(0, separate);
                                let textData = fs.readFileSync(absPath, 'utf8');
                                let fstat = fs.statSync(absPath);
                                let reg = RegExp(regMdFileText);
                                if (obvaultdata.bp_peer[basename]) {
                                    obvaultdata.bp_peer[basename].push(getRelativePath(suppliedPath, fullpath_basename));
                                } else {
                                    obvaultdata.bp_peer[basename] = [getRelativePath(suppliedPath, fullpath_basename)];
                                }
                                if (reg.test(textData)) {
                                    if (obvaultdata.mdFiles[basename]) {
                                        obvaultdata.mdFiles[basename].push({
                                            path: getRelativePath(suppliedPath, fullpath_basename),
                                            data: textData,
                                            created: $tw.utils.stringifyDate(fstat.birthtime),
                                            modified: $tw.utils.stringifyDate(fstat.mtime),
                                            basename: basename,
                                            extension: extension
                                        });
                                    } else {
                                        obvaultdata.mdFiles[basename] = [{
                                            path: getRelativePath(suppliedPath, fullpath_basename),
                                            data: textData,
                                            created: $tw.utils.stringifyDate(fstat.birthtime),
                                            modified: $tw.utils.stringifyDate(fstat.mtime),
                                            basename: basename,
                                            extension: extension
                                        }];
                                    }
                                }
                            }
                        } else if (!ignore.includes(item_path)) {
                            // 是目录
                            // 排除不需要的目录。可能需要更高级的形式。
                            stack.push(absPath);
                        }
                    }
                }
            } else {
                state.sendResponse(400, { "Content-Type": "text/plain" }, "Not folder: " + suppliedPath);
                return false;
            }
            return obvaultdata;
        }


        var getRelativePath = function (sourcePath, targetPath) {
            sourcePath = sourcePath.replace(/\\/g, '/'); //C:/Users/Snowy/Desktop/vault
            targetPath = targetPath.replace(/\\/g, '/'); //C:\Users\Snowy\Desktop\vault\⭐健康.md
            return targetPath.slice(sourcePath.length + 1);
        }

        // Main
        // 即使options.ignore的值是字符串，但使用options.ignore调用后就会变成[]类型。
        const data = catalogs(suppliedPath, options.ignore, options.regText);
        if (data != false) {
            const content = JSON.stringify(data);
            // Send the file
            state.sendResponse(200, { "Content-Type": "application/json" }, content);
        }
    };
}());