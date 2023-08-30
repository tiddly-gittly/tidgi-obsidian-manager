# tw5-obsidian-vault

[中文](/README.md) | [英文](/README_en-US.md)

> Obsidian Vault发布工具 by NodeJS TiddlyWiki
>
> NodeJS版TiddlyWiki插件。在 TW 中导入 Obsidian Vault 管理（添加，更新，清空）或作为发布方式 
>
> TidGi v0.8.0 需要在工作区设置 博客和服务器设置中 启用 HTTP API 并 关闭 凭证鉴权选项。
>
> 更新需要先点清除在点导入；因为条目名的唯一性，建议一个wiki仅导入一个obsidian vault。

- [x] 提供清除写入（导入）文件的清空操作。
- [x] 提供对md和ob链接和附件语法的适配。
- [x] 提供根据目录导入ob存储库的['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg']文件。
- [x] 提供写入文件的记录功能。
- [x] 提供筛选文件和忽略文件夹功能。
- [x] 提供转写obsidian文件系统目录树的功能。
- [x] 支持多个仓库导入。
- [ ] 支持删除单个仓库。
- [ ] 提供从obsidian更新文件功能，提供保留已修改的文件选项。默认则与ob知识库文件同步。

预览链接：https://tiddly-gittly.github.io/tidgi-obsidian-manager/

## 依赖插件：tiddlywiki/markdown
支持的语法包括但不限于：

```
*这是倾斜的文字*
**这是加粗的文字**
***这是倾斜加粗的文字***
==这是加高亮的文字==
~~这是加删除线的文字~~
<u>这是加下划线的文字</u>
```

## 如何使用

> TidGi ≥ v0.8.0 需要在工作区设置 博客和服务器设置中 启用 HTTP API 并 关闭 凭证鉴权选项。

- 点击侧边栏 - VaultTrees 选项卡，点击P字母链接。或者点击设置（控制台）- 设置 选项卡- OBM-Panel 选项卡。
- 在文本框中输入 Obsidian Vault 文件夹路径，点击 Add 按钮。
- 你可以在输入“过滤文件”中输入正则，仅检出符合匹配的文件放到你的wiki中。你可以在“ignore”中输入表达式选择忽略掉一些文件夹。
- 你可以使用purge按钮清空添加的内容。
- 你可以在开发者模式-控制台中观看到正在进行的操作。

### ignore表达式

留空，即默认忽略 ".git", ".obsidian", ".stfolder", ".stversions" 四个文件夹。

附加表达式：可以在ignore输入框输入`+文件夹名称, 文件夹名称, ...`，注意首字母必须为`+`，忽略更多文件夹。注意是英文逗号。

完全自定义：若首字母非`+`字符，则为自定义忽略需要忽略的文件夹。

### 过滤文件表达式

使用正则表达式匹配文件中是否含有匹配内容，如“def::pub”，若文件中含有匹配内容，则检出写入wiki中。


## 备忘录：

```
https://github.com/Jermolene/TiddlyWiki5/blob/9b59dff275e996ea5fa602912e2ff670d50e5b89/plugins/tiddlywiki/dynaview/dynaview.js#L150
`$tw.wiki.getTiddlerText(title)`：返回标题为title的Tiddler的文本内容。
`$tw.wiki.getTiddlerData(title)`：返回标题为title的Tiddler的JSON格式数据。可以通过该API获取Tiddler的所有属性和字段。

TypeScript 中使用 CSS Modules：https://juejin.cn/post/6844903497532473352
```
