import { IChangedTiddlers } from 'tiddlywiki';
import { widget as Widget } from '$:/core/modules/widgets/widget.js';

class ExampleWidget extends Widget {
  refresh(_changedTiddlers: IChangedTiddlers) {
    return false;
  }

  render(parent: Node, _nextSibling: Node) {
    this.parentDomNode = parent;
    this.execute();
    // 在这里写UI以及http请求。
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/obstore/C:/Users/Snowy/Documents/GitHub/Neural-Networks", true);
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        // 响应内容已准备好，可以使用 xhr.responseText 访问它
        console.log("http请求")
        console.log(xhr.responseText);
      }
    };
    xhr.send();

    const containerElement = $tw.utils.domMaker('p', {
      text: 'This is a widget!',
    });
    this.domNodes.push(parent.appendChild(containerElement));
  }
}

exports.obm = ExampleWidget;
