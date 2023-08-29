const fs = require('fs');

const tData = fs.readFileSync('./pyTestWIki/雏菊.md', 'utf8');
const bp_peer = {
    // 最简链接，链接一般为最简形式，仅含有文件名，需要替换为对应的相对路径。[[filename]] [[filename|代替文本]]
    "filename.md": ["path/filename"],
    "选择透过性.md": ["元素/选择透过性"],
    "细胞膜.md": ["元素/细胞膜"],
    // 相对链接，链接一般为特称，带有路径分隔符，但排除url。直接使用不用替换。[[元素/追问深度]] [[元素/追问深度|代替文本]]
    "追问深度.md": ["元素/追问深度", "特殊/追问深度"],
    "稀缺性原理.md": ["元素/稀缺性原理.md"],
    "空白.md": ["元素/空白.md"],
    // url链接，仅url链接。[[filename]] [[filename|代替文本]]
}

// [超链接显示名](超链接地址 "超链接title")，这种可以不用转换，因为都支持。可能因为文件名更改需要转换地址。

/**
 * 输入任意obmd[[]]链接：[[元素/追问深度]] [[元素/追问深度|代替文本]]  [[filename]] [[filename|代替文本]] 
 * @param {string} page_content 源文本
 * @returns [[代替文本|λ:/vault/path/name]]
 */
function links_wiki_syntax(page_content, bp_peer, vaultname) {
    const ob_link = { pattern: /(?<!!)\[\[(.*?)\]\]/g, target: "[[$1]]" };
    const md_link = { pattern: /(?<!!)\[(.*?)\]\((.*?)\)/g, target: "[[$1]]" };
    const link_array = [...page_content.matchAll(ob_link.pattern)];
    console.log(link_array);
    for (const item in link_array) {
        const content = link_array[item][1]; // $1
        const link_str = link_array[item][0]; // [[$1]]
        const content_arr = content.split('|'); // a|b -> [a, b]; a -> [a]
        const file_link = content_arr[0];
        if (content_arr.length === 1) {
            // [[filename]] filename 为 最简链接、url、相对链接
            if (isUrl(file_link)) {
                break;
            }
            // [[元素/追问深度]] -> [[追问深度|λ:/vault/元素/追问深度]]
            if (!(isUrl(file_link)) && file_link.includes('/')) {
                var page_content = page_content.replace(link_str, "[[" + content_arr[0].split('/').slice(-1) + '|' + 'λ:/' + vaultname + '/' + content_arr[0] + "]]");
            }
            // [[最简链接(追问深度)]] -> [[追问深度|λ:/vault/元素/追问深度]]
            let fname = file_link + ".md";
            if (fname in bp_peer) {
                let pathf = bp_peer[fname][0];
                pathf = pathf.replace(/.md$/, "");
                if (pathf) {
                    var page_content = page_content.replace(link_str, "[[" + content_arr[0] + '|' + 'λ:/' + vaultname + '/' + pathf + "]]");
                }
            }
        }
        if (content_arr.length > 1) {
            // [[url|代替文本]] -> [[代替文本|url]]
            if (isUrl(file_link)) {
                var page_content = page_content.replace(link_str, "[[" + content_arr[1] + '|' + content_arr[0] + "]]");
            }
            // [[相对链接|代替文本（文件名）]] -> [[代替文本（文件名）| 相对链接]]
            if (!(isUrl(file_link)) && file_link.includes('/')) {
                var page_content = page_content.replace(link_str, "[[" + content_arr[1] + '|' + 'λ:/' + vaultname + '/' + content_arr[0] + "]]");
            }
            // [[最简链接|代替文本（文件名）]] -> [[代替文本（文件名）| 对应相对路径]]
            let fname = file_link + ".md";
            if (fname in bp_peer) {
                let pathf = bp_peer[fname][0];
                if (pathf) {
                    pathf = pathf.replace(/.md$/, "");
                    var page_content = page_content.replace(link_str, "[[" + content_arr[1] + '|' + 'λ:/' + vaultname + '/' + pathf + "]]");
                }
            }
        }
    }
    return page_content
}

function isUrl(str) {
    var v = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
    return v.test(str);
}


var result = links_wiki_syntax(tData, bp_peer, "N");
console.log(result);
