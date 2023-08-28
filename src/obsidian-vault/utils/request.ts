import { tm_notify } from "./notify";

async function fetchData(path: string, regText: string, ignoreText: string) {
    let Ignored_by_default = [".git", ".obsidian", ".stfolder", ".stversions"];
    if (ignoreText === "") {
        var ignore = JSON.stringify(Ignored_by_default);
    }
    if (ignoreText !== "" || ignoreText.at(0) === "+") {
        var ignoreArray = ignoreText.substring(1).replace(/[ ]/g, "").split(",");
        var ignore = JSON.stringify(Ignored_by_default.concat(ignoreArray));
    }
    if (ignoreText !== "" && ignoreText.at(0) !== "+") {
        var ignoreArray = ignoreText.replace(/[ ]/g, "").split(",");
        var ignore = JSON.stringify(ignoreArray);
    }
    // 内置插件 $:/temp/info-plugin。
    // 相对请求路径 obvault/<path> 也可以使用。
    let fullUrl = $tw.wiki.getTiddlerText("$:/info/url/full");
    var route = fullUrl + "obvault" + "/" + path + `?regText=${regText}&ignore=${ignore}`;
    console.log("获取数据:" + route);
    tm_notify("获取数据 (fetchData)  ", `"${route}"`);
    // 需要排除非文件夹的路径。
    const response = await fetch(route);
    if (response.status == 400) {
        tm_notify("获取数据 (fetchData)  ", "Not Folder");
        return false;
    }
    const data = await response.json();
    console.log("获取完成, 正在写入到wiki中。");
    tm_notify("获取数据 (fetchData)  ", "获取完成, 正在写入到wiki中");
    return data;
}

export { fetchData };