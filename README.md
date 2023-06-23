# tw5-obsidian-manager

> 在NodeJS版TiddlyWiki中导入Obsidian知识库

- [x] 提供清除写入（导入）文件的清空操作。
- [x] 提供对md和ob一般图片语法的替换，替换为`[img[]]`
- [x] 提供根据目录导入ob存储库的md、jpg、png、jpeg文件。
- [x] 提供写入文件的记录功能。
- [ ] 提供更多的ob/md语法适配功能。
- [ ] 提供筛选文件和忽略文件夹功能。
- [ ] 提供从obsidian更新文件功能，提供不覆盖已修改的文件选项。即覆写更新与普通更新。
- [ ] 提供导入obsidian目录树功能

预览链接：https://tiddly-gittly.github.io/tidgi-obsidian-manager/

## 备忘录：

```
https://github.com/Jermolene/TiddlyWiki5/blob/9b59dff275e996ea5fa602912e2ff670d50e5b89/plugins/tiddlywiki/dynaview/dynaview.js#L150
`$tw.wiki.getTiddlerText(title)`：返回标题为title的Tiddler的文本内容。
`$tw.wiki.getTiddlerData(title)`：返回标题为title的Tiddler的JSON格式数据。可以通过该API获取Tiddler的所有属性和字段。

TypeScript 中使用 CSS Modules：https://juejin.cn/post/6844903497532473352
```
