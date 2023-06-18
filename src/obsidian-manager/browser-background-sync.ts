/* eslint-disable unicorn/no-array-callback-reference */
import type { Tiddler, IServerStatus, ITiddlerFieldsParam } from 'tiddlywiki';
import mapValues from 'lodash/mapValues';
import cloneDeep from 'lodash/cloneDeep';
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
                console.log("获取完成");

                // 其实点几次都可以，只有一次有效。
                this.addObsidian(this.GV.getData());
            }
        });
        $tw.rootWidget.addEventListener('tw-obsidian-purge', async (event) => {
            this.purgeStore();
        });
        $tw.rootWidget.addEventListener('tw-obsidian-update', async (event) => {

        });
    }

    async start(skipStatusCheck?: boolean) {

    }

    async wiki_markdown_syntax(content) {
        let c_o_img = content.replace(/\!\[\[(.*?)\]\]/g, "[img[$1]]");
        let c_md_img = c_o_img.replace(/\!\[(.*?)\]\((.*?)\)/g, "[img[$2]]");
        // 匹配这个语法,以后再说吧.
        //  ![[xx.jpg|400]] => [img[Description of image|TiddlerTitle]]
        return c_md_img
    }

    async addObsidian(obDate: {}) {
        // 加入提示，消息。
        // console.log("创建条目：");
        // 应该是每创建一个条目，写入一条记录。到时候删除也是从记录里面删除。
        // 或者，就是route里面的list，我将创建他们。所以我将删除他们。
        let written_list = [];
        for (const key in obDate.md) {
            // 替换掉图片语法为[img[]]。
            let text  = await wiki_markdown_syntax(obDate.md[key]);
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
        let tiddler_list = JSON.parse($tw.wiki.getTiddlerText("$:/plugins/whitefall/obsidian-manager/records-written-to-tiddlers"));
        tiddler_list.forEach(title => {
            console.log("删除条目：" + title);
            $tw.wiki.deleteTiddler(title);
        });
    }

    async fetchData(route: string) {
        console.log("获取数据:" + route)
        const response = await fetch(route);
        const data = await response.json();
        return data;
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export { BackgroundSyncManager }