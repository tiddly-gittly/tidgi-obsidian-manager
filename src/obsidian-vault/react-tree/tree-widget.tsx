import { IChangedTiddlers } from 'tiddlywiki';
import { widget as Widget } from '$:/core/modules/widgets/widget.js';

import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
// import { type IDefaultWidgetProps, ParentWidgetContext } from '$:/plugins/linonetwo/tw-react/index.js';
import App from "./App";


class TreeWidget extends Widget {
  /**
   * 在需要时选择性地刷新 widget。如果需要重新渲染 widget 或其任何子控件，则返回 true
   */
  refresh(changedTiddlers: IChangedTiddlers) {
    var changedAttributes = this.computeAttributes();
    return false;
  }

  async render(parent:any, _nextSibling:any) {
    this.parentDomNode = parent;
    this.execute();
    // 如何在这里使用CSS呢？
    const containerElement = $tw.utils.domMaker('div', {
      text: 'This is a tree widget!',
    });
    const root = ReactDOMClient.createRoot(containerElement);
    // root.render(
    //   <StrictMode>
    //     <App />
    //   </StrictMode>
    // );
    this.parentDomNode.append(containerElement)
  }
}

exports.retree = TreeWidget;
