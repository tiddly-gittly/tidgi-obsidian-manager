import { fetchData } from "./utils/request";
import { addVault, purgeVault } from "./utils/vault";
import { tm_notify } from "./utils/notify";

class ObvaultServer {

    constructor() {
        $tw.rootWidget.addEventListener('tw-obsidian-add', async (event) => {
            // 其实点几次都可以，只有一次有效。
            if (this.isValidPath(event.paramObject.path)) {
                let data = await fetchData(event.paramObject.path, event.paramObject.reg, event.paramObject.ignore);
                // console.log(data);
                if (data != false) { addVault(data); }
            }
        });
        $tw.rootWidget.addEventListener('tw-obsidian-purge', async (event) => {
            purgeVault();
        });
        $tw.rootWidget.addEventListener('tw-obsidian-update', async (event) => { });
    }
    isValidPath(path: string) {
        const pathRegEx = /^(\/|\.\.?\/|([A-Za-z]:)?[\\|\/])[^\\|\/]+([\\|\/][^\\|\/]+)*[\\|\/]?$/
        if (path === '') {
            console.log("路径为空！");
            tm_notify("addVault", "路径为空！");
            return false
        }
        if (!pathRegEx.test(path)) {
            console.log("无效路径！");
            tm_notify("addVault", "无效路径！");
            return false
        }
        return true
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export { ObvaultServer };
