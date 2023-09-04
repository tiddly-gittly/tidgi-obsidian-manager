import { fetchData } from "./utils/request";
import { addVault, purgeVault } from "./utils/vault";
import { tm_notify } from "./utils/notify";

class ObvaultServer {

    constructor() {
        $tw.rootWidget.addEventListener('tw-obsidian-add', async (event) => {
            if (event.type === "tw-obsidian-add") {    
                console.log(event.paramObject.path);
                // 其实点几次都可以，只有一次有效。
                if (event.paramObject.path !== '') {
                    let data = await fetchData(event.paramObject.path, event.paramObject.reg, event.paramObject.ignore);
                    // console.log(data);
                    if (data != false) { addVault(data); }
                } else {
                    console.log("输入为空！");
                    tm_notify("addVault", "输入为空！");
                }
            }
        });
        $tw.rootWidget.addEventListener('tw-obsidian-purge', async (event) => {
            purgeVault();
        });
        $tw.rootWidget.addEventListener('tw-obsidian-update', async (event) => { });
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export { ObvaultServer };
