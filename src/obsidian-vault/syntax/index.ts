function isUrl(str: string) {
    var v = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
    return v.test(str);
}

function is_simple_link(obvault: any, link_content: string) {
    let count_repeat = 0
    for (const i in obvault.mds) {
        let curr_mdfile = obvault.mds[i]
        let { relpath, data, created, modified, basename, extension } = curr_mdfile
        if (relpath.includes('/')) {
            // 有/符号是路径，检出文件名。
            var filename = relpath.split('/').slice(-1)[0]
        } else {
            // 没有/符号，是文件名。
            var filename = relpath
        }
        if (filename === link_content) {
            count_repeat += 1
        }
    }
    if (count_repeat == 1) {
        // 路径中只存在唯一一个文件名。在最简链接的语境下，缩减路径只保留文件名。
        return true
    }
    if (count_repeat >= 2) {
        // 路径中存在多个文件名，但在最简链接的语境下，只能为 [[root/?filenama]]相对链接。
        return false
    }
    return null
}

function find_simple_link(obvault: any, link_content: string) {
    for (const i in obvault.mds) {
        let curr_mdfile = obvault.mds[i]
        let { relpath, data, created, modified, basename, extension } = curr_mdfile
        // 仅返回在最简链接的语境下，缩减路径只保留文件名的链接。
        // 在当前路径中只存在唯一一个文件名的语境中：
        // 先是路径中，若不是，可能是位于根目录下的文件。
        if (relpath.includes('/')) {
            let filename = relpath.split('/').slice(-1)[0]
            // 包含/分隔符说明是路径，并且文件名要等于最简链接。
            if (filename === link_content) {
                return relpath
            }
        } else {
            // 路径还有一个 位于根路径下的文件:root/?readme
            let filename = relpath
            // 包含/分隔符说明是路径，并且文件名要等于最简链接。
            if (filename === link_content) {
                return relpath
            }
        }
    }
}


/**
 * 输入任意obsidian链接：[[]]、最简链接、相对链接、含参链接
 * @param {string} page_content 源文本
 * @param {string} vaultname 仓库名
 * @returns [[代替文本|λ:/vault/path/name]]
 */
function links_wiki_syntax(obvault: any, page_content: string) {
    const link_syntax = { ob_pattern: /(?<!!)\[\[(.*?)\]\]/g, md_pattern: /(?<!!)\[(.*?)\]\((.*?)\)/g };
    // 当前md文件中存在的链接列表。
    const link_array = [...page_content.matchAll(link_syntax.ob_pattern)];
    for (const item in link_array) {
        let link_strfull = link_array[item][0]; // [[$1]]
        let link_content = link_array[item][1]; // $1
        let link_param_arr = link_content.split('|'); // a|b to [a, b]; a to [a]
        let main_param = link_param_arr[0];
        // 链接中可以存在.md后缀。
        // 都是md文件所以不需要区分。
        // [[$1]]，仅链接无参数
        if (link_param_arr.length === 1) {
            if (isUrl(main_param)) {
                break;
            } else {
                // 最简链接 [[filename]]
                if (!main_param.includes('/')) {
                    if (is_simple_link(obvault, link_content)) {
                        var page_content = page_content.replace(link_strfull, `[[${main_param}|λ:/${obvault.vaultname}/${find_simple_link(obvault, main_param)}]]`);
                    } else {
                        var page_content = page_content.replace(link_strfull, `[[${main_param}|λ:/${obvault.vaultname}/${main_param}]]`);
                    }
                }
                // 相对链接 [[root/?path/filename]] 
                // 若位于根目录下[[root/?filename]] 这种情况是特殊的最简链接
                if (main_param.includes('/')) {
                    var page_content = page_content.replace(link_strfull, `[[${main_param.split('/').slice(-1)}|λ:/${obvault.vaultname}/${main_param}]]`);
                }
            }
        }
        // [[$1|name]]，含参数链接。
        if (link_param_arr.length >= 2) {
            let alias_param = link_param_arr[1]
            // [[url|alias_name]] to [[alias_name|url]]
            if (isUrl(main_param)) {
                var page_content = page_content.replace(link_strfull, `[[${alias_param}|${main_param}]]`);
            } else {
                // [[filename|alias_name]] to [[alias_name|filename]]
                if (!main_param.includes('/')) {
                    if (is_simple_link(obvault, link_content)) {
                        var page_content = page_content.replace(link_strfull, `[[${alias_param}|λ:/${obvault.vaultname}/${find_simple_link(obvault, main_param)}]]`);
                    } else {
                        var page_content = page_content.replace(link_strfull, `[[${alias_param}|λ:/${obvault.vaultname}/${main_param}]]`);
                    }
                }
                // [[相对链接|alias_name]] to [[alias_name| 相对链接]]
                if (main_param.includes('/')) {
                    var page_content = page_content.replace(link_strfull, `[[${alias_param}|λ:/${obvault.vaultname}/${main_param}]]`);
                }
            }
        }
    }
    return page_content
}

// Embeds ![[]]
function embeds_im_syntax(obvault: any, page_content: any) {
    const im_syntax = { ob_pattern: /\!\[\[(.*?)\]\]/g, md_pattern: /\!\[(.*?)\]\((.*?)\)/g };
    const ext_def = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    const im_ob_array = [...page_content.matchAll(im_syntax.ob_pattern)];
    const im_md_array = [...page_content.matchAll(im_syntax.md_pattern)];
    for (const im in im_ob_array) {
        let im_str_full = im_ob_array[im][0]; // ![[$1]]
        let im_content = im_ob_array[im][1]; // $1
        let im_param_arr = im_content.split('|'); // a|b to [a, b]
        let main_name = im_param_arr[0]
        let link_extension = main_name.split(".").slice(-1)[0]
        if (ext_def.indexOf(link_extension) !== -1) {
            if (im_param_arr.length == 1) {
                var page_content = page_content.replace(im_str_full, `[img [${main_name.trim()}]]`);
            }
            if (im_param_arr.length >= 2) {
                let size = im_param_arr.slice(-1)[0] * 1;
                if (typeof size === 'number') {
                    var page_content = page_content.replace(im_str_full, `[img width=${size} [${main_name.trim()}]]`);
                }
            }
        } else {
            // MD嵌入。仅限内部MD文件：最简链接 [[filename]]
            // `{{λ:/vaultname/filename}}`
            // 可能是其它类型的文件，比如xmind等等。
            if (!main_name.includes('/')) {
                if (is_simple_link(obvault, main_name)) {
                    var page_content = page_content.replace(im_str_full, `{{λ:/${obvault.vaultname}/${find_simple_link(obvault, main_name.trim())}}}`);
                } else {
                    var page_content = page_content.replace(im_str_full, `{{λ:/${obvault.vaultname}/${main_name.trim()}}}`);
                }
            }
        }
    }

    // ![AltText|100x100](https://url/to/image.png) url、内部链接
    for (const im in im_md_array) {
        let im_str_full = im_md_array[im][0]; // ![AltText|100x100](https://url/to/image.png)
        let im_param = im_md_array[im][1]; // AltText|100x100
        let im_link = im_md_array[im][2]; // https://url/to/image.png
        let im_param_arr = im_param.split('|'); // a|b to [a, b]
        let alttext = im_param_arr[0]
        // ![](url or filename)
        // [img [Motovun Jack.jpg]]
        if (im_param_arr.length === 0 || alttext.trim() === '') {
            var page_content = page_content.replace(im_str_full, `[img [${im_link}]]`)
        }
        // ![alttext](url or filename)
        if (im_param_arr.length === 1) {
            var page_content = page_content.replace(im_str_full, `[img [${alttext.trim()}|${im_link}]]`)
        }
        // ![AltText|100x100](url or filename)
        // [img width=32 [Motovun Jack|Motovun Jack.jpg]]
        if (im_param_arr.length >= 2) {
            let size = im_param_arr.slice(-1)[0].split('x')[0] * 1;  // 100x100
            if (typeof size === 'number') {
                var page_content = page_content.replace(im_str_full, `[img width=${size} [${alttext.trim()}|${im_link}]]`)
            }
        }
    }
    return page_content
}

function bold_wiki_syntax(page_content: string) {
    page_content = page_content.replace(/\x20*\*\*(.*?)\*\*\x20*/g, " **$1** ");
    return page_content
}

function shiraz_callout_syntax(page_content: string) {
    const ob_pattern = /^(> .+\n?)+$/gm;
    // 当前md文件中存在的链接列表。
    const callout_array = [...page_content.matchAll(ob_pattern)];
    for (const item in callout_array) {
        var callout_str_full = callout_array[item][0];
        var callout_line = callout_str_full.split(">")
        var head = callout_line.splice(0, 2).join("")
        var body = callout_line.join("")
        var head_arr: any[] = []
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
    }
    return page_content
}


async function convert(obvault: any, page_content: string) {
    if (typeof page_content === 'undefined' || page_content.length === 0) {
        return page_content;
    }
    page_content = embeds_im_syntax(obvault, page_content);
    page_content = links_wiki_syntax(obvault, page_content);
    page_content = bold_wiki_syntax(page_content);
    page_content = shiraz_callout_syntax(page_content);
    return page_content;
}

export { convert };