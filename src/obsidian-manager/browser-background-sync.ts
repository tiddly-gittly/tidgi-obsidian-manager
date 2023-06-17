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
            // if (event.type === "tw-obsidian-add") {
            // const params = $tw.wiki.getTiddlerData(event.paramTiddler, {});
            // console.log(params);
            // this.addObsidian(params);
            this.GV.resolve(await this.fetchData(event.param));
            // }
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

    async addObsidian() {
        // 加入提示，消息。
        for (const key in obDate.md) {
            // 替换掉图片的符号。
            let title = key.split(".")[0];
            // $tw.wiki.addTiddler(new $tw.Tiddler({ title: title, type: "text/markdown", text: obDate.md[key] }));
            console.log("创建条目：" + title);
        }
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