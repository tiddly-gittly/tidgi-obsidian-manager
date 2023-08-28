async function obmd_to_wiki(page_content: string, bp_peer: {}) {
    // 替换掉md&图片语法为[img width=num [ 图片替代文字 | 内部链接 ]]。正则代表一类情况。
    let wiki_img_syntax = [
        // ![[内部链接]] -> [img[内部链接]]
        { pattern: /\!\[\[([^|]*?)\]\]/g, target: "[img[$1]]" },
        // ![[内部链接|100]] -> [img width=100 [内部链接]]
        { pattern: /\!\[\[(.*?)\|(.*?)\|*(\d+)\]\]/g, target: "[img width=$3 [$1]]" },
        // ![](图片地址) -> [img[图片地址]]
        { pattern: /\!\[\]\((.*?)\)/g, target: "[img[$1]]" },
        // ![图片替代文字](图片地址) -> [img[图片替代文字|图片地址]]
        { pattern: /\!\[(.*?)\]\((.*?)\)/g, target: "[img[$1|$2]]" }
    ];
    // TODO: ob特殊语法， ![图片替代文字|100](图片地址) -> [img width=100 [图片替代文字|图片地址]]
    for (const index in wiki_img_syntax) {
        const element = wiki_img_syntax[index];
        var page_content = page_content.replace(element.pattern, element.target);
    }
    let wiki_link_syntax = [
        // [[filename|代替文本]] -> [[代替文本|filename]]，使用负向预查来排除以"!"开头的匹配项.
        { pattern: /\[\[(?!.*!).*?\|(.*?)\]\]/g, target: "[[$2|$1]]" },
        { pattern: /\[\[(?!.*!).*?\]\]/g, target: "[[$1]]" }
    ]
    for (const index in wiki_link_syntax) {
        const element = wiki_link_syntax[index];
        const array = [...page_content.matchAll(element.pattern)];
        // let filename = element.pattern.exec()[0];
        console.log(array);

        var page_content = page_content.replace(element.pattern, element.target);
    }
    return page_content
}

export { obmd_to_wiki }