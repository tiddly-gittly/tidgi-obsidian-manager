async function img_wiki_syntax(page_content: string, bp_peer: {}) {
    // 替换掉md&图片语法为[img width=num [ 图片替代文字 | 内部链接 ]]。正则代表一类情况。
    let img_wiki_syntax = [
        // ![[内部链接]] -> [img[内部链接]]
        { pattern: /\!\[\[([^|]*?)\]\]/g, target: "[img[$1]]" },
        // ![[内部链接|100]] -> [img width=100 [内部链接]]
        { pattern: /\!\[\[(.*?)\|(.*?)\|*(\d+)\]\]/g, target: "[img width=$3 [$1]]" },
        // ![](图片地址) -> [img[图片地址]]
        { pattern: /\!\[\]\((.*?)\)/g, target: "[img[$1]]" },
        // ![图片替代文字](图片地址) -> [img[图片替代文字|图片地址]]
        { pattern: /\!\[(.*?)\]\((.*?)\)/g, target: "[img[$1|$2]]" }
    ];

    for (const index in img_wiki_syntax) {
        const element = img_wiki_syntax[index];
        var page_content = page_content.replace(element.pattern, element.target);
    }
    return page_content
}

export { img_wiki_syntax }