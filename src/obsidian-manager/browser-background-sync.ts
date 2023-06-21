/* eslint-disable unicorn/no-array-callback-reference */
import type { Tiddler, IServerStatus, ITiddlerFieldsParam } from 'tiddlywiki';
import { asyncGV } from './async-global-variables'

class BackgroundSyncManager {

    constructor() {
        // TODO: get this from setting
        this.setupListener();
        this.GV = asyncGV.getInstance();
    }

    setupListener() {
        $tw.rootWidget.addEventListener('tw-obsidian-add', async (event) => {
            if (event.type === "tw-obsidian-add") {
                // const params = $tw.wiki.getTiddlerData(event.paramTiddler, {});
                this.GV.resolve(await this.fetchData(event.param));
                console.log("获取完成, 正在写入到wiki中。");

                // 其实点几次都可以，只有一次有效。
                await this.addStore(this.GV.getData());
                console.log("addStore: 所有工作已完成。");
                this.tm_notify("addStore", "所有工作已完成");
            }
        });
        $tw.rootWidget.addEventListener('tw-obsidian-purge', async (event) => {
            this.purgeStore();
        });
        $tw.rootWidget.addEventListener('tw-obsidian-update', async (event) => {

        });
    }

    tm_notify(generalNotification, message: string) {
        $tw.wiki.addTiddler({ title: `$:/state/notification/${generalNotification}`, text: `${generalNotification}: ${message}` });
        $tw.notifier.display(`$:/state/notification/${generalNotification}`);
    }

    async wiki_markdown_syntax(content) {
        // 替换掉图片语法为[img[]]。
        let c_o_img = content.replace(/\!\[\[(.*?)\]\]/g, "[img[$1]]");
        let c_md_img = c_o_img.replace(/\!\[(.*?)\]\((.*?)\)/g, "[img[$2]]");
        // 匹配这个语法,以后再说吧.
        //  ![[xx.jpg|400]] => [img[Description of image|TiddlerTitle]]
        return c_md_img
    }

    async addStore(obDate: {}) {
        // 应该是每创建一个条目，写入一条记录。到时候删除也是从记录里面删除。
        // 或者，就是route里面的list，我将创建他们。所以我将删除他们。
        let written_list = [];
        for (const key in obDate.md) {
            let text = await this.wiki_markdown_syntax(obDate.md[key]);
            let title = key.split(".")[0];
            $tw.wiki.addTiddler(
                new $tw.Tiddler({
                    title: title,
                    type: "text/markdown",
                    text: text
                }));
            written_list.push(title);
            console.log("创建条目：" + title);
        }
        for (const fileName in obDate.image) {
            let type = "image/" + fileName.substring(fileName.lastIndexOf(".") + 1)
            $tw.wiki.addTiddler(
                new $tw.Tiddler({
                    title: fileName,
                    type: type,
                    text: obDate.image[fileName]
                }));
            written_list.push(fileName);
            console.log("创建图片条目：" + fileName);
        }
        written_list.push("$:/plugins/whitefall/obsidian-manager/records-written-to-tiddlers");
        $tw.wiki.addTiddler(
            new $tw.Tiddler({
                title: "$:/plugins/whitefall/obsidian-manager/records-written-to-tiddlers",
                text: JSON.stringify(written_list)
            }));
    }

    async purgeStore() {
        let TiddlerText = $tw.wiki.getTiddlerText("$:/plugins/whitefall/obsidian-manager/records-written-to-tiddlers");
        if (typeof (TiddlerText) !== "undefined") {
            let tiddler_list = JSON.parse(TiddlerText);
            // if (tiddler_list.length !== 0) {
            tiddler_list.forEach(title => {
                console.log("删除条目：" + title);
                $tw.wiki.deleteTiddler(title);
            });
            this.tm_notify("purgeStore", "已经全部清空。");
            // }
        } else {
            this.tm_notify("purgeStore", "未曾添加OB库，obsidian写入记录为空。");
        }
    }

    async fetchData(path: string) {
        let route = "/obstore" + "/" + path;
        console.log("获取数据:" + route);
        this.tm_notify("fetchData", `"${route}"`);
        const response = await fetch(route);
        const data = await response.json();
        return data;
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export { BackgroundSyncManager }