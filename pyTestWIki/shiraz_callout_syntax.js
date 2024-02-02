const fs = require('fs');


function shiraz_callout_syntax(page_content) {
    const quote_pattern = /^( {0,3}> ?(.+|[^\n]*)(?:\r?\n|$))+/mg;
    // 当前md文件中存在的链接列表。
    const quotes_array = [...page_content.matchAll(quote_pattern)];
    for (const item in quotes_array) {
        var quotes_str_full = quotes_array[item][0];
        if (!quotes_str_full.includes("[!")) continue;
        var callout_line = quotes_str_full.split(">")
        var head = callout_line.slice(0, 2).join("")
        var body = callout_line.slice(2).join("")
        var head_arr = []
        if (/]\r?\n/g.test(head)) {
            head = head.trim()
            head_arr.push(head)
        } else {
            head = head.trim()
            if (head.includes("]-")) {
                head_arr.push(head.slice(0, head.indexOf("]-") + 1)) // 从]符号后开始
                head_arr.push(head.slice(head.indexOf("]-") + 3)) // 从空格后开始
            }
            else {
                // indexOf返回数组中第一次出现给定元素的下标，如果不存在则返回 -1。
                head_arr.push(head.slice(0, head.indexOf(" ") + 1).trim())
                head_arr.push(head.slice(head.indexOf(" ") + 1))
            }
        }
        // let title = head_arr.length == 2 ? head_arr[1].substring(0, head_arr[1].length - 1) : ""
        let type = head_arr[0].substring(2, head_arr[0].length - 1).toLowerCase()
        let title = head_arr.length == 2 ? head_arr[1] : ""
        var page_content = page_content.replace(quotes_str_full, `<<callout type:"${type}" title:"${title}" src:"${body}">>\n`);
    }
    return page_content
}


const str = fs.readFileSync('./pyTestWIki/Callout.md').toString();

console.log(shiraz_callout_syntax(str));
// console.log(str);
