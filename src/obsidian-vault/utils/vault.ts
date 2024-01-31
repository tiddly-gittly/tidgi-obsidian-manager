import { convert } from "../syntax/index";
import { tm_notify } from "./notify";

async function addVault(obvault: { vaultname: string; mds: any; ims: { [x: string]: any; }; }) {
    // 使用obvault字段记录写入历史和仓库名。
    // Set(basename:[{path,data}])
    // λ:/vault/path/name
    console.log("vaultName: " + obvault.vaultname);
    let user_name = $tw.wiki.getTiddlerText("$:/status/UserName");
    console.log(obvault);
    for (const i in obvault.mds) {
        let curr_mdfile = obvault.mds[i]
        let { relpath, data: curr_fdata, created, modified, basename, extension } = curr_mdfile
        let text = await convert(obvault, curr_fdata);
        let title = `λ:/${obvault.vaultname}/${relpath}`;
        $tw.wiki.addTiddler(
            new $tw.Tiddler({
                title: title,
                type: "text/markdown",
                caption: basename,
                created: created,
                modified: modified,
                modifier: user_name,
                text: text,
                obvault: obvault.vaultname
            }));
        // console.log("创建MD条目：" + title);

    }
    for (const i in obvault.ims) {
        let curr_image = obvault.ims[i]
        let { relpath, data, created, modified, basename, extension } = curr_image
        let title = `${basename}.${extension}`;
        let type = `image/${extension}`;
        $tw.wiki.addTiddler(
            new $tw.Tiddler({
                title: title,
                type: type,
                text: data,
                obvault: obvault.vaultname
            }));
        // console.log("创建IM条目：" + title);

    }
    console.log("addVault: 所有添加工作已完成。");
    tm_notify("addVault", "所有添加工作已完成，请等待【文件系统同步服务】完成任务。");
}

async function purgeVault(vaultName: string) {
    console.log("purgeVault: " + vaultName);
    if (vaultName !== '') {
        let delete_vault = $tw.wiki.filterTiddlers(`[field:obvault[${vaultName}]]`);
        tm_notify("purgeVault", `正在清空${vaultName}Vault`);
        await deleteTiddler(delete_vault);
    }
    //默认、不指定就删除所有的。
    if (vaultName === undefined || vaultName === '') {
        let tiddler_list = $tw.wiki.filterTiddlers("[has:field[obvault]]");
        await deleteTiddler(tiddler_list);
    }
}

async function deleteTiddler(tiddler_list: string[]) {
    if (tiddler_list.length !== 0) {
        tiddler_list.forEach((title: string) => {
            console.log("删除条目：" + title);
            $tw.wiki.deleteTiddler(title);
        });
        tm_notify("purgeVault", "所有删除工作已完成, 请等待【文件系统同步服务】完成任务。");
    } else {
        tm_notify("purgeVault", "未曾添加Obsidian仓库, 写入记录为空。");
    }
}

export { addVault, purgeVault }