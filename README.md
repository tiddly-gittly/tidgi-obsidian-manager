# tw5-obsidian-manager

此tw导入后的库不可编辑。只是为了显示和部署。每次更新都完全清除此tw库的的内容然后导入。反正只是为了显示好看那就将差不多的显示效果的文本替换一下。

就是向tw导入obsidian库，然后用tw发布的。


## 备忘录：

```
添加，更新，清空
addTiddler，`$tw.wiki.deleteTiddler(title)`;
https://github.com/Jermolene/TiddlyWiki5/blob/9b59dff275e996ea5fa602912e2ff670d50e5b89/plugins/tiddlywiki/dynaview/dynaview.js#L150
`$tw.wiki.getTiddlerText(title)`：返回标题为title的Tiddler的文本内容。
`$tw.wiki.getTiddlerData(title)`：返回标题为title的Tiddler的JSON格式数据。可以通过该API获取Tiddler的所有属性和字段。

TypeScript 中使用 CSS Modules：https://juejin.cn/post/6844903497532473352
```