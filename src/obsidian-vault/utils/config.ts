const CONFIG_FILE = "$:/config/obsidian-vault/vault-rw-config";

/**
 * 获得CONFIG_FILE，并对意外情况下的修改进行处理;
 * @returns {}
 */
function _getConfig() {
    let Config = $tw.wiki.getTiddlerText(CONFIG_FILE);
    // 说明还没有写入记录
    if (Config === undefined) {
        return {};
    } else {
        try {
            // 说明可以获得到这个条目。
            Config = JSON.parse(Config);
            return Config;
        } catch (error) {
            console.log("解析JSON失败, 不是正确的JSON格式!");
            console.log(error);
            $tw.wiki.deleteTiddler(CONFIG_FILE);
            return {};
        }
    }
}

function addConfig(mConfig) {
    // $tw.wiki.addTiddler若存在条目内容则会使用新的覆盖旧的。
    // 同名属性会被后面对象的属性值覆盖。
    // let Config = $tw.wiki.getTiddlerText(CONFIG_FILE) || "{}";
    // Config = JSON.parse(Config);
    let Config = _getConfig();
    Config = { ...Config, ...mConfig };
    $tw.wiki.addTiddler(
        new $tw.Tiddler({
            title: CONFIG_FILE,
            text: JSON.stringify(Config),
        })
    );
}

function getConfigJSON() {
    // let tiddler = $tw.wiki.getTiddlerText(CONFIG_FILE);
    // return JSON.parse(tiddler);
    return _getConfig();
}

function deleteConfig(vaultName: string) {
    let Config = $tw.wiki.getTiddlerText(CONFIG_FILE);
    if (Config !== undefined) {
        Config = JSON.parse(Config);
        delete Config[vaultName];
        $tw.wiki.addTiddler(
            new $tw.Tiddler({
                title: CONFIG_FILE,
                text: JSON.stringify(Config),
            })
        );
    }
    if (vaultName === undefined || vaultName === '') {
        $tw.wiki.deleteTiddler(CONFIG_FILE);
    }
}

export { addConfig, getConfigJSON, deleteConfig };