import { tm_notify } from "./utils/notify";
import { addVault, purgeVault } from "./utils/vault";
import { fetchData } from "./utils/request";

class ObvaultServer {

    constructor() {
        $tw.rootWidget.addEventListener('tw-obsidian-add', async (event) => {
            if (event.type === "tw-obsidian-add") {
                // 其实点几次都可以，只有一次有效。
                let data = await fetchData(event.param[0], event.param[1], event.param[2]);
                // console.log(data);
                if (data != false) {
                    addVault(data);
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
