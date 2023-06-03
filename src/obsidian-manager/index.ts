import { IChangedTiddlers } from 'tiddlywiki';
import { widget as Widget } from '$:/core/modules/widgets/widget.js';

class ObMainWidget extends Widget {
  refresh(_changedTiddlers: IChangedTiddlers) {
    return false;
  }

  render(parent: Node, _nextSibling: Node) {
    this.parentDomNode = parent;
    this.execute();
    function fetchData() {
      return new Promise(async (resolve, reject) => {
        const response = await fetch('/obstore/C:/Users/Snowy/Documents/GitHub/Neural-Networks');
        const data = await response.json();
        resolve(data);
      });
    }
    const containerElement = $tw.utils.domMaker('p', {
      text: 'This is a widget!',
    });
    const addButtonElement = $tw.utils.domMaker("button", {
      class: "my-button",
      text: "Add",
    });
    const purgeButtonElement = $tw.utils.domMaker("button", {
      class: "my-button",
      text: "purge",
    });

    addButtonElement.onclick = function () {
      fetchData().then(date => {
        console.log(date);
      })
      // 加入提示，消息。
      // for (const key in obDate.md) {
      //   // 替换掉图片的符号。
      //   let title = key.split(".")[0];
      //   // $tw.wiki.addTiddler(new $tw.Tiddler({ title: title, type: "text/markdown", text: obDate.md[key] }));
      //   console.log("创建条目：" + title);
      // }
    }

    purgeButtonElement.onclick = function () {

    }
    this.domNodes.push(parent.appendChild(containerElement));
    this.domNodes.push(parent.appendChild(addButtonElement));
    this.domNodes.push(parent.appendChild(purgeButtonElement));
  }
}

exports.obm = ObMainWidget;
