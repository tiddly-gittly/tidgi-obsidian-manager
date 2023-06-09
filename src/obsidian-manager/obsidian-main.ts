import { IChangedTiddlers } from 'tiddlywiki';
import { widget as Widget } from '$:/core/modules/widgets/widget.js';
import { BackgroundSyncManager } from './browser-service'

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
      <label for="reg">过滤文件: </label>
      <input type="text" id="ob-widget-regText" name="reg" placeholder="请输入表达式">
      <label for="ignore">ignore: </label>
      <input type="text" id="ob-widget-ignore" name="ignore" placeholder="暂时不可用">
    </div>
    <button class="ob-main-widget-button" id="ob-button-Add" title="点击添加OB库">Add</button>
    <button class="ob-main-widget-button" id="ob-button-purge" title="点击清空已添加的OB库">purge</button>
    `;
    this.domNodes.push(parent.appendChild(containerElement));

    const addButton = document.getElementById("ob-button-Add");
    const purgeButton = document.getElementById("ob-button-purge");
    const inputBox = document.getElementById("ob-widget-path");
    const regBox = document.getElementById("ob-widget-regText");
    const ignoreBox = document.getElementById("ob-widget-ignore");


    addButton.onclick = function () {
      if (inputBox.value.length == 0) {
        console.log("输入为空！");
        bgsm.tm_notify("addStore", "输入为空！");
        // inputBox.value = "C:/Users/Snowy/Documents/GitHub/Neural-Networks";
      } else {
        $tw.rootWidget.dispatchEvent({ type: 'tw-obsidian-add', param: [inputBox.value, regBox.value] })
      }
    }

    purgeButton.onclick = function () {
      $tw.rootWidget.dispatchEvent({ type: 'tw-obsidian-purge' })
    }
  }
}

exports.obm = ObMainWidget;
