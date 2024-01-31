// Embeds ![[]]
function embeds_wiki_syntax(obvault, extension, page_content) {
    const im_syntax = { ob_pattern: /\!\[\[(.*?)\]\]/g, md_pattern: /\!\[(.*?)\]\((.*?)\)/g };
    page_content = page_content.replace(/\!\[\[(.*?)\]\]/g, (match, p1) => {
        const content_arr = p1.split('|');
        // const ext = content_arr[0].split('.').slice(-1)[0].trim();
        const ext_def = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
        if (ext_def.indexOf(extension) !== -1) {
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
                const pathf = uniquelink_in_tree_path(content_arr[0], bp_peer);
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