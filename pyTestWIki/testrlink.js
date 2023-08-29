const fs = require('fs');

const tData = fs.readFileSync('./pyTestWIki/雏菊.md', 'utf8');
const bp_peer = {
    // 最简链接，链接一般为最简形式，仅含有文件名，需要替换为对应的相对路径。[[filename]] [[filename|代替文本]]
    "filename.md": ["λ:/path/filename"],
    "选择透过性.md": ["λ:/vault/元素/选择透过性"],
    "细胞膜.md": ["λ:/vault/元素/细胞膜"],
    // 相对链接，链接一般为特称，带有路径分隔符，但排除url。直接使用不用替换。[[元素/追问深度]] [[元素/追问深度|代替文本]]
    "追问深度.md": ["λ:/vault/元素/追问深度", "β:/vault/特殊/追问深度"]
    // url链接，仅url链接。[[filename]] [[filename|代替文本]]
}

/**
 * 输入任意obmd[[]]链接：[[元素/追问深度]] [[元素/追问深度|代替文本]]  [[filename]] [[filename|代替文本]] 
 * @param {string} text 源文本
 * @returns [[代替文本|λ:/vault/path/name]]
 */
function link_syntax(text) {
    const link = { pattern: /(?<!!)\[\[(.*?)\]\]/g, target: "[[$1]]" };
    const link_array = [...text.matchAll(link.pattern)];
    console.log(link_array);
    for (const item in link_array) {
        const content = link_array[item][1]; // $1
        const link_str = link_array[item][0]; // [[$1]]
        const content_arr = content.split('|'); // a|b -> [a, b]; a -> [a]
        const file_link = content_arr[0];
        if (content_arr.length > 1) {
            // [[url|代替文本]] -> [[代替文本|url]]
            if (isUrl(file_link)) {
                var text = text.replace(link_str, "[[" + content_arr[1] + '|' + content_arr[0] + "]]");
            }
            // [[相对链接|代替文本（文件名）]] -> [[代替文本（文件名）| 相对链接]]
            if (!(isUrl(file_link)) && file_link.includes('/')) {
                var text = text.replace(link_str, "[[" + content_arr[1] + '|' + content_arr[0] + "]]");
            }
            // [[最简链接|代替文本（文件名）]] -> [[代替文本（文件名）| 对应相对路径]]
            let fname = file_link + ".md";
            if (fname in bp_peer) {
                let pathf = bp_peer[fname][0];
                if (pathf) {
                    var text = text.replace(link_str, "[[" + content_arr[1] + '|' + pathf + "]]");
                }
            }
        }
        if (content_arr.length = 1) {
            // [[filename]] filename 为 最简链接、url、相对链接
            if (!(isUrl(file_link)) && file_link.includes('/')) {
                var text = text.replace(link_str, "[[" + content_arr[0].split('/').slice(-1) + '|' + content_arr[0] + "]]");
            }
            let fname = file_link + ".md";
            if (fname in bp_peer) {
                let pathf = bp_peer[fname][0];
                if (pathf) {
                    var text = text.replace(link_str, "[[" + content_arr[0] + '|' + pathf + "]]");
                }
            }
        }

    }
    return text
}

function isUrl(str) {
    var v = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
    return v.test(str);
}


var result = link_syntax(tData);
console.log(result);
