import { IChangedTiddlers } from 'tiddlywiki';
import { widget as Widget } from '$:/core/modules/widgets/widget.js';
import { BackgroundSyncManager } from './browser-background-sync'

class ObMainWidget extends Widget {
  refresh(_changedTiddlers: IChangedTiddlers) {
    return false;
  }
  // 通过小部件消息激活任务。
  // 公共的存储库应该也是一个解决方案。

  async render(parent: Node, _nextSibling: Node) {
    this.parentDomNode = parent;
    this.execute();
    new BackgroundSyncManager();
    const containerElement = $tw.utils.domMaker('p', {
      text: 'This is a widget!',
    });
    const addButtonElement = $tw.utils.domMaker("button", {
      class: "ob-main-widget-button",
      text: "Add",
    });
    const purgeButtonElement = $tw.utils.domMaker("button", {
      class: "ob-main-widget-button",
      text: "purge",
    });

    addButtonElement.onclick = function () {
      $tw.rootWidget.dispatchEvent({ type: 'tw-obsidian-add', param: "/obstore/C:/Users/Snowy/Documents/GitHub/Neural-Networks" })
      // $tw.rootWidget.dispatchEvent({ type: this.message, param: this.param, tiddlerTitle: this.getVariable("currentTiddler") });
    }

    purgeButtonElement.onclick = function () {
      $tw.rootWidget.dispatchEvent({ type: 'tw-obsidian-purge' })
    }
    this.domNodes.push(parent.appendChild(containerElement));
    this.domNodes.push(parent.appendChild(addButtonElement));
    this.domNodes.push(parent.appendChild(purgeButtonElement));
  }
}

exports.obm = ObMainWidget;
