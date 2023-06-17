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

    // 如何在这里获取到所有一次请求后的数据呢？
    setupListener() {
        $tw.rootWidget.addEventListener('tw-obsidian-add', async (event) => {
            if (event.type === "tw-obsidian-add") {
                // const params = $tw.wiki.getTiddlerData(event.paramTiddler, {});
                this.GV.resolve(await this.fetchData(event.param));
                console.log("获取完成");

                // this.GV.pushV("tiddlerList",this.GV.getData().list);
                // console.log(this.GV.getK("tiddlerList"));
                // 其实点几次都可以，只有一次有效。
                this.addObsidian(this.GV.getData());
            }
        });
        $tw.rootWidget.addEventListener('tw-obsidian-purge', async (event) => {
            var a = this.GV.getData();
            if (a) {
                console.log(a.list);
            }
        });
        $tw.rootWidget.addEventListener('tw-obsidian-update', async (event) => {

        });
    }

    async start(skipStatusCheck?: boolean) {

    }

    async onSyncStart(skipStatusCheck?: boolean) {

    }

    async addObsidian(obDate: {}) {
        // 加入提示，消息。
        for (const key in obDate.md) {
            // 替换掉图片语法为[img[]]。
            var c_o_img = obDate.md[key].replace(/\!\[\[(.*?)\]\]/g, "[img[$1]]");
            var c_md_img = c_o_img.replace(/\!\[(.*?)\]\((.*?)\)/g, "[img[$2]]")
            let title = key.split(".")[0];
            $tw.wiki.addTiddler(new $tw.Tiddler({ title: title, type: "text/markdown", text: c_md_img }));
            console.log("创建条目：" + title);
            // console.log("创建条目：");
            // 应该是每创建一个条目，写入一条记录。到时候删除也是从记录里面删除。
        }
        console.log("tiddlerList",);
        $tw.wiki.addTiddler(new $tw.Tiddler({ title: "$:/plugins/whitefall/obsidian-manager/records-written-to-tiddlers", text: JSON.stringify(this.GV.getData().list) }))
    }

    async purgeStore() {

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