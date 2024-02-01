const fs = require('fs');


function shiraz_callout_syntax(page_content) {
    const ob_pattern = /^(> .+\n?)+$/gm;
    // 当前md文件中存在的链接列表。
    const callout_array = [...page_content.matchAll(ob_pattern)];
    for (const item in callout_array) {
        var callout_str_full = callout_array[item][0];
        var callout_line = callout_str_full.split(">")
        var head = callout_line.splice(0, 2).join("")
        var body = callout_line.join("")
        var head_arr = []
        if (head.includes(']\n')) {
            head = head.trim()
            head_arr.push(head)
        } else {
            head = head.trim()
            if (head.includes('-')) {
                head_arr = head.split("- ")
            }
            if (!head.includes('-')) {
                head_arr.push(head.slice(0, head.indexOf(" ") + 1).trim())
                head_arr.push(head.slice(head.indexOf(" ") + 1))
            }
        }
        // let title = head_arr.length == 2 ? head_arr[1].substring(0, head_arr[1].length - 1) : ""
        let type = head_arr[0].substring(2, head_arr[0].length - 1).toLowerCase()
        let title = head_arr.length == 2 ? head_arr[1] : ""
        var page_content = page_content.replace(callout_str_full, `<<callout type:"${type}" title:"${title}" src:"${body}">>`);
        console.log(page_content);
    }
}


const str = fs.readFileSync('./pyTestWIki/Callout.md').toString();
shiraz_callout_syntax(str)
console.log(str);
