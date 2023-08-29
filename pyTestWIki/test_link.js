const fs = require('fs');

var twText = fs.readFileSync('./pyTestWIki/雏菊.md', 'utf8');

// ![[内部链接]] 并不只有img，还可以是音乐、视频、pdf。
// 仅满足自己的需要，这些仅考虑存放在附件中。所以仅对md进行树状化格式和重命名。
// ![[内部链接|100]]
// ![图片替代文字](图片地址)
// ![图片替代文字|100](图片地址)

// ![[内部链接]] 、 ![图片alt](图片链接 "图片title") = <img src="图片链接" alt="图片alt" title="图片title">

// 若是为图片类型则有 参数：图片大小。


// ![[内部链接|alt|100]]

twText = twText.replace(/\!\[\[(.*?)\]\]/g, (match, p1) => {
    const content_arr = p1.split('|');
    const ext = content_arr[0].split('.').slice(-1);
    const defext = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    console.log(content_arr);
    if (defext.indexOf(ext)) {
        // 是图片类型，有位于尾部的大小参数。
        // [img width=100 [内部链接]]
        if (content_arr.length === 1) {
            return '[img ' + '[' + content_arr[0] + ']]';
        }
        if (content_arr.length > 1) {
            let size = content_arr.slice(-1)[0] * 1;
            if (typeof size === 'number') {
                return '[img width=' + size + ' [' + content_arr[0] + ']]';
            }
        }
    } else {
        // 非图片附件类型。
        return '{{' + p1 + '}}'
    }
});


// ![AltText|100x100](https://url/to/image.png) url、内部链接
twText = twText.replace(/\!\[(.*?)\]\((.*?)\)/g, (match, p1, p2) => {
    const content_arr = p1.split('|');
    const link = p2;
    const ext = link.split('.').slice(-1);
    const defext = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'ico'];
    console.log(content_arr);
    if (defext.indexOf(ext)) {
        // [img [Motovun Jack.jpg]]
        if (content_arr.length === 0 || content_arr[0] === '') {
            return '[img ' + '[' + link + ']]';
        }
        if (content_arr.length === 1) {
            return '[img ' + '[' + content_arr[0] + '|' + link + ']]';
        }
        // ![AltText|100x100](https://url/to/image.png)
        // [img width=32 [Motovun Jack|Motovun Jack.jpg]]
        if (content_arr.length > 1) {
            let size = content_arr.slice(-1)[0].split('x')[0] * 1;
            if (typeof size === 'number') {
                return '[img width=' + size + ' [' + content_arr[0] + '|' + link + ']]';
            }
        }
    } else {
        return match
    }
});

console.log(twText);