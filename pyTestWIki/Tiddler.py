# coding=utf-8

class Tiddler:
    def __init__(self) -> None:
        self.fields = {}

    # def Tiddler():
    #     tiddler = {"title": None,
    #                "name": None,
    #                "author": None,
    #                "text": None,
    #                "type": None,
    #                "tags": None,
    #                "creator": None,
    #                "modifier": None,
    #                "modified": None,
    #                "created": None}
    #     return tiddler


# https://github.com/Jermolene/TiddlyWiki5/blob/9b59dff275e996ea5fa602912e2ff670d50e5b89/boot/boot.js#L1186

# 我希望的是创建一个tiddler对象，最终是催字典和数组进行操作。动态的操作。

# tiddler的集合。
class Wiki:
    def __init__(self) -> None:
        self.tiddlerTitles = None
        self.pluginTiddlers = []
        self.pluginInfo = None

    def Tiddlers(tiddler):
        tiddlers = {"title": tiddler}
        return tiddlers

    def addTiddler(tiddler):
        tiddlers = object.__class__()
        if tiddler:
            title = tiddler.fields.title
            if title:
                tiddlers[title] = tiddler

    def deleteTiddler(tiddler):
        pass

    def addTiddlers(self, tiddlers):
        for tiddler in tiddlers:
            self.addTiddler(tiddler)

    def getTiddlerTitles(self):
        if self.tiddlerTitles == False or None:
            self.tiddlerTitles = []

    def getTiddler(title):
        pass

m = Tiddler()
m.fields["a"] = 1212
print(m)