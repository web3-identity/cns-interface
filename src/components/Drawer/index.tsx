import React, { createRef, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { isDOMElement } from '@utils/is';
import DrawerComponent, { type DrawerMethod } from './Drawer';
import { uniqueId } from 'lodash-es';
export { type DrawerMethod } from './Drawer';

export class DrawerClass implements DrawerMethod {
  drawerRef: RefObject<DrawerMethod>;
  show: DrawerMethod['show'];
  hide: DrawerMethod['hide'];
  isInInit: boolean = false;
  isEndInit: boolean = false;
  useProvider: boolean = false;
  completeInit!: (value: PromiseLike<void> | void) => void;
  initPromise: Promise<void>;

  constructor(useProvider: boolean = false) {
    this.drawerRef = createRef<DrawerMethod>();
    this.show = () => this.judgeInit();
    this.hide = () => this.judgeInit();
    this.initPromise = new Promise((resolve) => (this.completeInit = resolve));
    this.useProvider = useProvider; 
  }

  judgeInit(): any {

  }

  resetMethod = () => {
    this.show = this.drawerRef.current!.show;
    this.hide = this.drawerRef.current!.hide;
  };

  waitRefReady = () => {
    const judgeIsReady = () => {
      if (this.drawerRef.current) {
        this.completeInit();
      } else {
        setTimeout(judgeIsReady, 16);
      }
    };
    judgeIsReady();
    return this.initPromise;
  };

  init = async (container?: HTMLElement) => {
    if (!container || !isDOMElement(container)) {
      container = document.createElement('div');
      container.setAttribute('id', 'drawer-container-' + uniqueId());
      container.style.position = 'absolute';
      document.body.appendChild(container);
    }
    createRoot(container).render(<DrawerComponent ref={this.drawerRef} />);
    await this.waitRefReady();
    this.resetMethod();
    this.isEndInit = true;
  };

  Provider = ({ container }: { container?: HTMLElement; [otherProps: string]: any }) => {
    if (!container || !isDOMElement(container)) {
      container = document.createElement('div');
      container.setAttribute('id', 'drawer-container-' + uniqueId());
      container.style.position = 'absolute';
      document.body.appendChild(container);
    }
    const component = createPortal(React.createElement(DrawerComponent, { ref: this.drawerRef }), container);
    this.waitRefReady().then(() => {
      this.resetMethod();
      this.isEndInit = true;
    });
    return component;
  };
}

export default new DrawerClass();
