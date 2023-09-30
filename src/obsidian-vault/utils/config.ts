// 收集配置，写入状态条目，以待使用。使用Vault名作为关键字。
// 你需要先读取在写入。否则可能会覆盖从而丢失数据。

const CONFIG_FILE = "$:/config/obsidian-vault/vault-rw-config";

function addConfig(mConfig) {
    let Config = $tw.wiki.getTiddlerText(CONFIG_FILE) || "{}";
    // 同名属性会被后面对象的属性值覆盖。
    Config = JSON.parse(Config);
    Config = { ...Config, ...mConfig };
    // 存在条目内容则会覆盖。
    $tw.wiki.addTiddler(
        new $tw.Tiddler({
            title: CONFIG_FILE,
            text: JSON.stringify(Config),
        })
    );
}

function getConfigJSON() {
    let tiddler = $tw.wiki.getTiddlerText(CONFIG_FILE);
    return JSON.parse(tiddler);
}

function deleteConfig(vaultName: string) {
    let Config = $tw.wiki.getTiddlerText(CONFIG_FILE);
    if (Config !== undefined) {
        Config = JSON.parse(Config);
        delete Config[vaultName]
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