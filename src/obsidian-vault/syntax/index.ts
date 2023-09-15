function isUrl(str) {
    var v = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
    return v.test(str);
}

// 唯一或根 链接
function unique_or_root_link(file_link, bp_peer) {
    let fname = file_link + ".md";
    if (fname in bp_peer) {
        let pathf_arr = bp_peer[fname]; //有多个文件路径，该选那个呢？最简链接位于根下、没有重复文件即一对一。
        // 没有重复，一对一。
        if (pathf_arr.length === 1) {
            let pathf = pathf_arr[0].replace(/.md$/, "");
            if (pathf) {
                return pathf;
            }
        }
        // 多个文件，最简链接对应文件位于根下，没有路径分隔符。
        if (pathf_arr.length > 1) {
            for (const index in pathf_arr) {
                let pathf = pathf_arr[index].replace(/.md$/, "");
                if (!pathf.includes('/')) {
                    return pathf;
                }
            }
        }
    }
    return ''
}


/**
 * 输入任意obmd[[]]链接：[[元素/追问深度]] [[元素/追问深度|代替文本]]  [[filename]] [[filename|代替文本]] 
 * @param {string} page_content 源文本
 * @param {{}} bp_peer 链接-路径文件名 peer，按文件名对位于不同路径的同名文件进行分类，通过链接给定线索检索路径文件名。
 * @param {string} vaultname 仓库名
 * @returns [[代替文本|λ:/vault/path/name]]
 */
function links_wiki_syntax(page_content, bp_peer, vaultname) {
    const ob_link = { pattern: /(?<!!)\[\[(.*?)\]\]/g, target: "[[$1]]" };
    const md_link = { pattern: /(?<!!)\[(.*?)\]\((.*?)\)/g, target: "[[$1]]" };
    const link_array = [...page_content.matchAll(ob_link.pattern)];
    for (const item in link_array) {
        const content = link_array[item][1]; // $1
        const link_str = link_array[item][0]; // [[$1]]
        const content_arr = content.split('|'); // a|b -> [a, b]; a -> [a]
        const file_link = content_arr[0];
        // 链接中是可以存在.md后缀的。目前暂时不支持了吧，我用不到。
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
            let pathf = unique_or_root_link(file_link, bp_peer);
            if (pathf !== '') {
                var page_content = page_content.replace(link_str, "[[" + content_arr[0] + '|' + 'λ:/' + vaultname + '/' + pathf + "]]");
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
            let pathf = unique_or_root_link(file_link, bp_peer);
            if (pathf !== '') {
                var page_content = page_content.replace(link_str, "[[" + content_arr[1] + '|' + 'λ:/' + vaultname + '/' + pathf + "]]");
            }
        }
    }
    return page_content
}

// Embeds ![[]]
function embeds_wiki_syntax(page_content, bp_peer, vaultname) {
    page_content = page_content.replace(/\!\[\[(.*?)\]\]/g, (match, p1) => {
        const content_arr = p1.split('|');
        const ext = content_arr[0].split('.').slice(-1)[0].trim();
        const defext = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
        if (defext.indexOf(ext) !== -1) {
            // 是图片类型，有位于尾部的大小参数。
            // [img width=100 [内部链接]]
            if (content_arr.length === 1) {
                return '[img ' + '[' + content_arr[0].trim() + ']]';
            }
            if (content_arr.length > 1) {
                let size = content_arr.slice(-1)[0] * 1;
                if (typeof size === 'number') {
                    return '[img width=' + size + ' [' + content_arr[0].trim() + ']]';
                }
            }
        } else {
            // 非图片嵌入类型。
            // 判断是否是内部MD文件。仅限非特定路径。
            if (content_arr.length === 1) {
                const pathf = unique_or_root_link(content_arr[0], bp_peer);
                if (pathf !== '') {
                    return '{{' + 'λ:/' + vaultname + '/' + pathf + '}}'
                }
            }
            // 非图片类型，默认返回嵌入
            return '{{' + p1 + '}}'
        }
    });


    // ![AltText|100x100](https://url/to/image.png) url、内部链接
    page_content = page_content.replace(/\!\[(.*?)\]\((.*?)\)/g, (match, p1, p2) => {
        const content_arr = p1.split('|');
        const link = p2;
        const ext = link.split('.').slice(-1)[0].trim();
        const defext = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'ico'];
        if (defext.indexOf(ext) !== -1) {
            // [img [Motovun Jack.jpg]]
            if (content_arr.length === 0 || content_arr[0].trim() === '') {
                return '[img ' + '[' + link + ']]';
            }
            if (content_arr.length === 1) {
                return '[img ' + '[' + content_arr[0].trim() + '|' + link + ']]';
            }
            // ![AltText|100x100](https://url/to/image.png)
            // [img width=32 [Motovun Jack|Motovun Jack.jpg]]
            if (content_arr.length > 1) {
                let size = content_arr.slice(-1)[0].split('x')[0] * 1;
                if (typeof size === 'number') {
                    return '[img width=' + size + ' [' + content_arr[0].trim() + '|' + link + ']]';
                }
            }
        } else {
            return match
        }
    });

    return page_content
}

function bold_wiki_syntax(page_content: string) {
    page_content = page_content.replace(/\x20*\*\*(.*?)\*\*\x20*/g, " **$1** ");
    return page_content
}


async function convert(page_content: string, bp_peer: {}, vaultname: string) {
    if (typeof page_content === 'undefined' || page_content.length === 0) {
        return page_content;
    }
    page_content = embeds_wiki_syntax(page_content, bp_peer, vaultname);
    page_content = links_wiki_syntax(page_content, bp_peer, vaultname);
    page_content = bold_wiki_syntax(page_content);
    return page_content;
}

export { convert };