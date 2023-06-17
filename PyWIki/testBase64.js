const fs = require('fs');

// 读取图片文件
// 相对路径是相对于node_modules所在项目的路径
// process.cwd()可以打印出当前工作目录
const imageData = fs.readFileSync('./PyWIki/image.png');

// 将二进制数据转换成base64编码
const base64ImageData = imageData.toString('base64');

console.log(base64ImageData);
