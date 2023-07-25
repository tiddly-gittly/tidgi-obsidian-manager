# tw5-obsidian-manager

> 在NodeJS版TiddlyWiki中导入Obsidian知识库
> 
> TidGi v0.8.0 需要在工作区设置 博客和服务器设置中 启用 HTTP API 并 关闭 凭证鉴权选项。

- [x] 提供清除写入（导入）文件的清空操作。
- [x] 提供对md和ob一般图片语法的替换，替换为`[img[]]`
- [x] 提供根据目录导入ob存储库的md、jpg、png、jpeg文件。
- [x] 提供写入文件的记录功能。
- [x] 提供筛选文件和忽略文件夹功能。
- [ ] 提供从obsidian更新文件功能，提供不覆盖已修改的文件选项。即覆写更新与普通更新。普通更新仅保留修改过的文件，未修改的文件将跟随ob知识库增加或删除。
- [ ] 提供转写obsidian文件系统目录树的功能。
- [ ] 提供导入多个Obsidian知识库的功能。

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

## 备忘录：

```
https://github.com/Jermolene/TiddlyWiki5/blob/9b59dff275e996ea5fa602912e2ff670d50e5b89/plugins/tiddlywiki/dynaview/dynaview.js#L150
`$tw.wiki.getTiddlerText(title)`：返回标题为title的Tiddler的文本内容。
`$tw.wiki.getTiddlerData(title)`：返回标题为title的Tiddler的JSON格式数据。可以通过该API获取Tiddler的所有属性和字段。

TypeScript 中使用 CSS Modules：https://juejin.cn/post/6844903497532473352
```
