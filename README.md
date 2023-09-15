# tw5-obsidian-vault

> Obsidian Vault发布工具 by NodeJS TiddlyWiki
>
> NodeJS版TiddlyWiki插件。在 TW 中导入 Obsidian Vault 管理（添加，更新，清空）或作为发布方式 

- [x] 提供清除写入（导入）文件的清空操作。
- [x] 提供对md和ob链接和附件语法的适配。
- [x] 支持ob存储库的['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg']文件。
- [x] 提供写入文件的记录功能。
- [x] 提供筛选文件和忽略文件夹功能。
- [x] 支持多个仓库导入，提供转写obsidian文件系统目录树展示的功能。
- [ ] 支持删除单个仓库。
- [ ] 提供多库列表同步和保留修改功能，默认则与ob知识库文件同步。
- [x] 支持obsidian风格硬换行，由tiddlywiki/markdown提供。

使用说明、参考手册和预览链接：https://tiddly-gittly.github.io/tidgi-obsidian-manager/

若页面没有更新，可以使用Ctrl + F5强制刷新缓存即可看到最新内容。

## 插件要求

- TiddlyWiki：core-version >= 5.2.0
- 需要太记TidGi或NodeJS版本的TiddlyWiki。
- 若 TidGi ≥ v0.8.0 版本，需要在**工作区设置** - **博客和服务器设置**中 - 启用 **HTTP API** 并 关闭 **凭证鉴权选项**。
- 更新笔记库，需要先点清除在点导入。（**慎重**，目前未提供单独删除某个笔记库的选项。点击purge后会全部清空。）


### 依赖插件：tiddlywiki/markdown
支持的语法包括但不限于：

```
*这是倾斜的文字*
**这是加粗的文字**
***这是倾斜加粗的文字***
==这是加高亮的文字==
~~这是加删除线的文字~~
<u>这是加下划线的文字</u>
```

支持obsidian风格硬换行格式，在插件ui/settings面板设置是否启用（默认启用）。修改设置需要刷新页面之后生效。

#### 硬换行

> https://talk.tiddlywiki.org/t/hard-linebreaks-while-entering-lists-in-wikitext/2494/2
> https://spec.commonmark.org/0.30/#hard-line-breaks

```
两种硬换行符：<space><space><newLine>或者<backslash>
例如：

这是空格换行符  (注意这里有两个空格和一个\n)
这是<backslash>换行符\  (注意这里有一个<backslash>和一个\n)

都可以达到同样的硬换行效果。
```