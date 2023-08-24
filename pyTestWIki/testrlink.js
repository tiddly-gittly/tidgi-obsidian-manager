const fs = require('fs');

const tData = fs.readFileSync('./pyTestWIki/雏菊.md', 'utf8');
const bp_peer = { "文件名.md": ["path"] }

// 1. 从一个文件中取出[[]]链接，变成链接列表。
// 2. 从列表中取出一个链接语法在从中取出文件名 处理成 key。
// 3. bp_peerp[key] 的唯一元素作为替换路径字符串。
// 4. 匹配 key , 并替换为路径字符串。

console.log(tData);

let wiki_link_syntax = [
    // [[filename|代替文本]] -> [[代替文本|filename]]，使用负向预查来排除以"!"开头的匹配项.
    { pattern: /\[\[(?!.*!).*?\]\]/g, target: "[[$1]]" }, //[[]] 全集
    { pattern: /\[\[(?!.*!)(.*?)\|(.*?)\]\]/g, target: "[[$2|$1]]" }, // [[]] 子集
]
for (const index in wiki_link_syntax) {
    const element = wiki_link_syntax[index];
    const array = [...tData.matchAll(element.pattern)];
    // let filename = element.pattern.exec()[0];
    console.log(array);
}
// 将二进制数据转换成base64编码

// console.log(base64ImageData);