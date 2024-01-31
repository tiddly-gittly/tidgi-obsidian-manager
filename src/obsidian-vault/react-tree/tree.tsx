import { StrictMode, useCallback, useEffect, useState, Component } from 'react';
import { type IDefaultWidgetProps, ParentWidgetContext } from '$:/plugins/linonetwo/tw-react/index.js';

/** every ms to save */
const debounceSaveTime = 500;
export interface IAppProps {
  /**
   * Tiddler to contain the serialized JSON component state
   */
  currentTiddler: string;
  height?: string;
  initialTiddlerText?: string;
  isDraft: boolean;
  readonly?: boolean;
  saver: {
    /** ms about debounce how long between save */
    interval?: number;
    /** a lock to prevent update from tiddler to slate, when update of tiddler is trigger by slate. */
    lock: () => void;
    onSave: (value: string) => void;
  };
  width?: string;
  zoom?: string;
  zoomToFit?: boolean;
}



export function App(props: IAppProps & IDefaultWidgetProps): JSX.Element {
  const {
    height,
    width,
    currentTiddler,
    initialTiddlerText,
    isDraft,
    readonly,
    zoomToFit,
    zoom,
    saver: { onSave, lock },
    parentWidget,
  } = props;


  return (
    <div style={{ height: 400 }}>

    </div>
  );
}

export default class Tree extends Component {
  constructor(props: IAppProps & IDefaultWidgetProps) {
    super(props);

    this.state = {
      treeData: [{ title: 'src/', children: [{ title: 'index.js' }] }],
    };
  }

  render() {
    return (
      <div style={{ height: 400 }}>

      </div>
    );
  }
}