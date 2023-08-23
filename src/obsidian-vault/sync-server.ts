/* eslint-disable unicorn/no-array-callback-reference */
import type { Tiddler, IServerStatus, ITiddlerFieldsParam } from 'tiddlywiki';

class SyncServer {

    constructor() {
        this.setupListener();
    }

    setupListener() {
        $tw.rootWidget.addEventListener('tw-obsidian-add', async (event) => {
            if (event.type === "tw-obsidian-add") {
                // 其实点几次都可以，只有一次有效。
                let data = await this.fetchData(event.param[0], event.param[1], event.param[2]);
                console.log(data);
                
                if (data != false) {
                    this.addVault(data);
                }
            }
        });
        $tw.rootWidget.addEventListener('tw-obsidian-purge', async (event) => {
            this.purgeVault();
        });
        $tw.rootWidget.addEventListener('tw-obsidian-update', async (event) => {

        });
    }

    tm_notify(generalNotification: string, message: string) {
        $tw.wiki.addTiddler({ title: `$:/state/notification/${generalNotification}`, text: `${generalNotification}: ${message}` });
        $tw.notifier.display(`$:/state/notification/${generalNotification}`);
    }

    async wiki_markdown_syntax(page_content: string) {
        // 替换掉md&ob图片语法为[img width=num [ 图片替代文字 | 内部链接 ]]。正则代表一类情况。
        // ![[内部链接]] -> [img[内部链接]]
        var no_ob_img = page_content.replace(/\!\[\[([^|]*?)\]\]/g, "[img[$1]]");
        // ![[内部链接|100]] -> [img width=100 [内部链接]]
        var no_ob_d_img = no_ob_img.replace(/\!\[\[(.*?)\|(.*?)\|*(\d+)\]\]/g, "[img width=$3 [$1]]");
        // ![](图片地址) -> [img[图片地址]]
        var on_md_img = no_ob_d_img.replace(/\!\[\]\((.*?)\)/g, "[img[$1]]");
        // ![图片替代文字](图片地址) -> [img[图片替代文字|图片地址]]
        var on_md_d_img = on_md_img.replace(/\!\[(.*?)\]\((.*?)\)/g, "[img[$1|$2]]");
        // [[filename|代替文本]] -> [[代替文本|filename]]
        // 使用负向预查来排除以"!"开头的匹配项.
        var wikilink = on_md_d_img.replace(/\[\[(?!.*!).*?\|.*?\]\]/, "[[$2|$1]]");
        // TODO: ob特殊语法， ![图片替代文字|100](图片地址) -> [img width=100 [图片替代文字|图片地址]]
        return wikilink
    }

    async addVault(obvaultdata: { obVaultName: string, mdFiles, imgFiles }) {
        // 使用obvault字段记录写入历史和仓库名。
        // Set(basename:[{path,data}])
        console.log("vaultName: " + obvaultdata.obVaultName);
        let user_name = $tw.wiki.getTiddlerText("$:/status/UserName");
        for (const mdfile_K in obvaultdata.mdFiles) {
            let md_file_arry = obvaultdata.mdFiles[mdfile_K];
            if (md_file_arry.length != 0 && md_file_arry.length == 1) {
                let text = await this.wiki_markdown_syntax(md_file_arry[0].data);
                let title = mdfile_K.split(".")[0];
                $tw.wiki.addTiddler(
                    new $tw.Tiddler({
                        title: title,
                        type: "text/markdown",
                        modified: md_file_arry[0].date,
                        modifier: user_name,
                        text: text,
                        obvault: obvaultdata.obVaultName,
                        vaulttree: "$:/" + md_file_arry[0].path.split(".")[0]
                    }));
                console.log("创建条目：" + title);
            } else if (md_file_arry.length > 1) {
                // 同文件名不同路径，title需要相对路径
                for (const pf in md_file_arry) {
                    let md_file = md_file_arry[pf];
                    let text = await this.wiki_markdown_syntax(md_file.data);
                    let title = md_file.path.split(".")[0];
                    $tw.wiki.addTiddler(
                        new $tw.Tiddler({
                            title: title,
                            type: "text/markdown",
                            modified: md_file.date,
                            modifier: user_name,
                            text: text,
                            obvault: obvaultdata.obVaultName,
                            vaulttree: "$:/" + md_file.path.split(".")[0]
                        }));
                    console.log("创建同名异径条目：" + title);
                }
            }
        }
        for (const imgfile_K in obvaultdata.imgFiles) {
            let img_file_arry = obvaultdata.imgFiles[imgfile_K];
            if (img_file_arry.length != 0 && img_file_arry.length == 1) {
                let imgName = imgfile_K;
                let type = "image/" + imgName.substring(imgName.lastIndexOf(".") + 1)
                $tw.wiki.addTiddler(
                    new $tw.Tiddler({
                        title: imgName,
                        type: type,
                        text: img_file_arry[0].data,
                        obvault: obvaultdata.obVaultName
                    }));
                console.log("创建图片条目：" + imgName);
            } else if (img_file_arry.length > 1) {
                for (const pf in img_file_arry) {
                    let img_file = img_file_arry[pf];
                    let imgName = img_file.path;
                    let type = "image/" + imgName.substring(imgName.lastIndexOf(".") + 1)
                    $tw.wiki.addTiddler(
                        new $tw.Tiddler({
                            title: imgName,
                            type: type,
                            text: img_file.data,
                            obvault: obvaultdata.obVaultName
                        }));
                    console.log("创建图片条目：" + imgName);
                }
            }
        }
        console.log("addVault: 所有添加工作已完成。");
        this.tm_notify("addVault", "所有添加工作已完成，请等待【文件系统同步服务】完成任务。");
    }

    async purgeVault(vaultName) {
        let tiddler_list = $tw.wiki.filterTiddlers("[has:field[obvault]]");
        if (tiddler_list.length !== 0) {
            tiddler_list.forEach((title: string) => {
                console.log("删除条目：" + title);
                $tw.wiki.deleteTiddler(title);
            });
            this.tm_notify("purgeVault", "已经完全清空，请等待【文件系统同步服务】完成任务。");
        } else {
            this.tm_notify("purgeVault", "未曾添加Obsidian仓库，写入记录为空。");
        }
    }

    async fetchData(path: string, regText: string, ignoreText: string) {
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
        this.tm_notify("获取数据 (fetchData)  ", `"${route}"`);
        // 需要排除非文件夹的路径。
        const response = await fetch(route);
        if (response.status == 400) {
            this.tm_notify("获取数据 (fetchData)  ", "Not Folder");
            return false;
        }
        const data = await response.json();
        console.log("获取完成, 正在写入到wiki中。");
        this.tm_notify("获取数据 (fetchData)  ", "获取完成, 正在写入到wiki中");
        return data;
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export { SyncServer }
