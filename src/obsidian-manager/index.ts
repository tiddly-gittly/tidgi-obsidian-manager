import { IChangedTiddlers } from 'tiddlywiki';
import { widget as Widget } from '$:/core/modules/widgets/widget.js';

class ObMainWidget extends Widget {
  refresh(_changedTiddlers: IChangedTiddlers) {
    return false;
  }

  render(parent: Node, _nextSibling: Node) {
    this.parentDomNode = parent;
    this.execute();
    // 在这里写UI以及http请求。
    const xhr = new XMLHttpRequest();
    let obDate;
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
      }
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
      // 加入提示，消息。
      xhr.open("GET", "/obstore/C:/Users/Snowy/Documents/GitHub/Neural-Networks", true);
      xhr.send();
      obDate = JSON.parse(xhr.response);
      for (const key in obDate.md) {
        // 替换掉图片的符号。
        let title = key.split(".")[0];
        // $tw.wiki.addTiddler(new $tw.Tiddler({ title: title, type: "text/markdown", text: obDate.md[key] }));
        console.log("创建条目：" + title);
      }
      // 发送请求。
    }

    purgeButtonElement.onclick = function () {

    }

    this.domNodes.push(parent.appendChild(containerElement));
    this.domNodes.push(parent.appendChild(addButtonElement));
    this.domNodes.push(parent.appendChild(purgeButtonElement));
  }
}

exports.obm = ObMainWidget;
