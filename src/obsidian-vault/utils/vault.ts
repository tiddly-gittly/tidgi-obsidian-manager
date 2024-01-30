import { convert } from "../syntax/index";
import { tm_notify } from "./notify";

async function addVault(obvaultdata: { obVaultName: string, mdFiles: { [x: string]: any; }, imgFiles: { [x: string]: any; }, bp_peer: {} }) {
    // 使用obvault字段记录写入历史和仓库名。
    // Set(basename:[{path,data}])
    // λ:/vault/path/name
    console.log("vaultName: " + obvaultdata.obVaultName);
    let user_name = $tw.wiki.getTiddlerText("$:/status/UserName");
    console.log(obvaultdata);
    for (const mdfile_K in obvaultdata.mdFiles) {
        let md_file_arry = obvaultdata.mdFiles[mdfile_K];
        if (md_file_arry.length != 0 && md_file_arry.length == 1) {
            let mdfile = md_file_arry[0]
            let text = await convert(mdfile.data, obvaultdata.bp_peer, obvaultdata.obVaultName);
            let title = `λ:/${obvaultdata.obVaultName}/${mdfile.path}`;
            $tw.wiki.addTiddler(
                new $tw.Tiddler({
                    title: title,
                    type: "text/markdown",
                    caption: mdfile.basename,
                    created: mdfile.created,
                    modified: mdfile.modified,
                    modifier: user_name,
                    text: text,
                    obvault: obvaultdata.obVaultName
                }));
            // console.log("创建条目：" + title);
        } else if (md_file_arry.length > 1) {
            // 同文件名不同路径，title需要相对路径
            for (const pf in md_file_arry) {
                let mdfile = md_file_arry[pf];
                let text = await convert(mdfile.data, obvaultdata.bp_peer, obvaultdata.obVaultName);
                let title = `λ:/${obvaultdata.obVaultName}/${mdfile.path}`;
                $tw.wiki.addTiddler(
                    new $tw.Tiddler({
                        title: title,
                        type: "text/markdown",
                        caption: mdfile.basename,
                        created: mdfile.created,
                        modified: mdfile.modified,
                        modifier: user_name,
                        text: text,
                        obvault: obvaultdata.obVaultName
                    }));
                // console.log("创建同名异径条目：" + title);
            }
        }
    }
    for (const imgfile_K in obvaultdata.imgFiles) {
        let img_file_arry = obvaultdata.imgFiles[imgfile_K];
        if (img_file_arry.length != 0 && img_file_arry.length == 1) {
            let imgfile = img_file_arry[0];
            let title = `${imgfile.basename}.${imgfile.extension}`;
            let type = `image/${imgfile.extension}`;
            $tw.wiki.addTiddler(
                new $tw.Tiddler({
                    title: title,
                    type: type,
                    text: img_file_arry[0].data,
                    obvault: obvaultdata.obVaultName
                }));
            // console.log("创建图片条目：" + title);
        } else if (img_file_arry.length > 1) {
            for (const pf in img_file_arry) {
                let imgfile = img_file_arry[pf];
                let title = imgfile.path;
                let type = `image/${imgfile.extension}`;
                $tw.wiki.addTiddler(
                    new $tw.Tiddler({
                        title: title,
                        type: type,
                        text: imgfile.data,
                        obvault: obvaultdata.obVaultName
                    }));
                // console.log("创建图片条目：" + title);
            }
        }
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