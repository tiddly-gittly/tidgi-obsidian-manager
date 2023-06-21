import { IChangedTiddlers } from 'tiddlywiki';
import { widget as Widget } from '$:/core/modules/widgets/widget.js';
import { BackgroundSyncManager } from './browser-background-sync'

class ObMainWidget extends Widget {
  refresh(_changedTiddlers: IChangedTiddlers) {
    return false;
  }

  async render(parent: Node, _nextSibling: Node) {
    this.parentDomNode = parent;
    this.execute();
    // 如何在这里使用CSS呢？
    const bgsm = new BackgroundSyncManager();

    const containerElement = document.createElement('div');
    containerElement.innerHTML = `
    <div class="ob-main-widget-input">
      <label for="path">文件夹路径: </label>
      <input type="text" id="ob-widget-path" name="path" placeholder="请输入路径。">
    </div>
    <button class="ob-main-widget-button" id="ob-button-Add" title="点击添加OB库">Add</button>
    <button class="ob-main-widget-button" id="ob-button-purge" title="点击清空已添加的OB库">purge</button>
    `;
    this.domNodes.push(parent.appendChild(containerElement));
    // 需要一个log视图。

    const addButton = document.getElementById("ob-button-Add");
    const purgeButton = document.getElementById("ob-button-purge");
    const inputBox = document.getElementById("ob-widget-path");

    addButton.onclick = function () {
      if (inputBox.value.length == 0) {
        console.log("输入为空！");
        bgsm.tm_notify("Add-Obsidian","输入为空！");
        return;
        inputBox.value = "C:/Users/Snowy/Documents/GitHub/Neural-Networks";
      }
      let route = "/obstore" + "/" + inputBox.value;
      $tw.rootWidget.dispatchEvent({ type: 'tw-obsidian-add', param: route })
    }

    purgeButton.onclick = function () {
      $tw.rootWidget.dispatchEvent({ type: 'tw-obsidian-purge' })
    }
  }
}

exports.obm = ObMainWidget;
