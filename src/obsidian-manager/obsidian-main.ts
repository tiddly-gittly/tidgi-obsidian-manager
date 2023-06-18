import { IChangedTiddlers } from 'tiddlywiki';
import { widget as Widget } from '$:/core/modules/widgets/widget.js';
import { BackgroundSyncManager } from './browser-background-sync'
import { text } from 'stream/consumers';
import './index.css';

class ObMainWidget extends Widget {
  refresh(_changedTiddlers: IChangedTiddlers) {
    return false;
  }

  async render(parent: Node, _nextSibling: Node) {
    this.parentDomNode = parent;
    this.execute();
    // 如何在这里使用CSS呢？
    new BackgroundSyncManager();
    $tw.rootWidget.addEventListener('tw-obsidian-log', async (event) => {
      console.log(event.param);
    });

    const containerElement = $tw.utils.domMaker('div', {
      class: "ob-main-widget",
    });
    const addButton = $tw.utils.domMaker("button", {
      class: "ob-main-widget-button",
      text: "Add",
      title: "点击添加OB库"
    });
    const purgeButton = $tw.utils.domMaker("button", {
      class: "ob-main-widget-button",
      text: "purge",
      title: "点击清空已添加的OB库"
    });

    const label = $tw.utils.domMaker("label", {
      class: "ob-main-widget-input-label",
      for: "path",
      text: "文件夹路径: "
    });

    const input = $tw.utils.domMaker("input", {
      class: "ob-main-widget-input",
      type: "text",
      id: "path",
      name: "path",
      placeholder: "请输入路径。",
    });

    // 需要一个log视图。

    addButton.onclick = function () {
      if (input.value.length == 0) {
        console.log("输入为空！");
        return;
        input.value = "C:/Users/Snowy/Documents/GitHub/Neural-Networks";
      }
      let route = "/obstore" + "/" + input.value;
      $tw.rootWidget.dispatchEvent({ type: 'tw-obsidian-add', param: route })
    }

    purgeButton.onclick = function () {
      $tw.rootWidget.dispatchEvent({ type: 'tw-obsidian-purge' })
    }

    containerElement.appendChild(label);
    containerElement.appendChild(input);
    containerElement.appendChild(addButton);
    containerElement.appendChild(purgeButton);
    this.domNodes.push(parent.appendChild(containerElement));
  }
}

exports.obm = ObMainWidget;
