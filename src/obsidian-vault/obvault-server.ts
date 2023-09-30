import { fetchData } from "./utils/request";
import { addVault, purgeVault } from "./utils/vault";
import { tm_notify } from "./utils/notify";
import { addConfig, getConfigJSON, deleteConfig } from "./utils/config";

class ObVaultServer {

    constructor() {
        $tw.rootWidget.addEventListener('tw-obsidian-add', async (event) => {
            // 其实点几次都可以，只有一次有效。
            await this.getAndWrite(event.paramObject.path, event.paramObject.reg, event.paramObject.ignore);
        });
        $tw.rootWidget.addEventListener('tw-obsidian-purge', async (event) => {
            purgeVault();
            deleteConfig();
        });

        $tw.rootWidget.addEventListener('tw-obsidian-sync', async (event) => {
            let obVaultName = event.paramObject.obvault;
            let Config = getConfigJSON();
            if (JSON.stringify(Config) !== '{}') {
                console.log("开始更新Vault。");
                tm_notify("Vault-Sync", "开始更新Vault。");

                purgeVault(obVaultName);
                await this.getAndWrite(Config[obVaultName].path, Config[obVaultName].reg, Config[obVaultName].ignore);
            } else {
                console.log("更新失败, CONFIG_FILE为空。重新添加Vault后, 将自动生成记录");
                tm_notify("Vault-Sync", "更新失败, CONFIG_FILE为空。重新添加Vault后, 将自动生成记录");
            }
        });
        $tw.rootWidget.addEventListener('tw-obsidian-delete', async (event) => {
            let obVaultName = event.paramObject.obvault;
            console.log(`删除Vault: ${obVaultName}`);
            tm_notify("Vault-Delete", `删除Vault: ${obVaultName}`);
            purgeVault(obVaultName);
            deleteConfig(obVaultName);
        });
    }

    async getAndWrite(path, reg, ignore) {
        if (this.isValidPath(path)) {
            let data = await fetchData(path, reg, ignore);
            // console.log(data);
            let Config = {};
            let vaultName = this.getFolderName(path);
            if (data !== undefined) {
                Config[vaultName] = { path: path, reg: reg, ignore: ignore };
                addVault(data);
                addConfig(Config);
            }
        }
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

    getFolderName(path) {
        var pos1 = path.lastIndexOf('/');
        var pos2 = path.lastIndexOf('\\');
        var pos = Math.max(pos1, pos2)
        if (pos < 0)
            return path;
        else
            return path.substring(pos + 1);
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export { ObVaultServer };
