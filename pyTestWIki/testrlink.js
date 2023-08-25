const fs = require('fs');

const tData = fs.readFileSync('./pyTestWIki/雏菊.md', 'utf8');
const bp_peer = {
    "文件名.md": ["path"],
    "选择透过性.md": ["000000"],
    "细胞膜.md": ["1111111"]
}

// 1. 从一个文件中取出[[]]链接，变成链接列表。
// 2. 从列表中取出一个链接语法在从中取出文件名 处理成 key。
// 3. bp_peerp[key] 的唯一元素作为替换路径字符串。
// 4. 匹配 key , 并替换为路径字符串。

/**
 * 
 * @param {string} text 源文本
 * @param {function} callback 给定(link_str, content_arr, text)自定义单个匹配结果link_str的处理方式
 * @returns 处理结果
 */
function link_syntax(text, callback) {
    // [[filename|代替文本]] -> [[代替文本|filename]]
    const link = { pattern: /(?<!!)\[\[(.*?)\]\]/g, target: "[[$1]]" };
    const link_array = [...text.matchAll(link.pattern)];
    for (const item in link_array) {
        const content = link_array[item][1]; // $1
        const link_str = link_array[item][0];
        const content_arr = content.split('|'); // filename|filename|filename分割数组
        var text = callback(link_str, content_arr, text);
    }
    return text
}

var result = link_syntax(tData, (link_str, content_arr, text) => {
    // [[filename|代替文本]] (content_arr: [filename, 代替文本]) -> [[代替文本|filename]]，并使用path替换掉filenam。
    let fname = content_arr[0] + ".md";
    if (typeof (bp_peer[fname]) !== 'undefined') {
        console.log(bp_peer[fname]);
        var pfname = bp_peer[fname][0];
        if (pfname) {
            text =  text.replace(link_str, pfname);
        }
    }
    return text
})
console.log(result);
