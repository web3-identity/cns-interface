import React, { memo, useEffect, useRef, type ReactNode } from 'react';
import cx from 'clsx';
import { useAccount } from '@service/account';
import { DrawerClass } from '@components/Drawer';
import renderReactNode from '@utils/renderReactNode';
import useCloseOnRouterBack from '../useCloseOnRouterBack';

export const DrawerPopup = new DrawerClass();

const Drawer: React.FC<{ Content: ReactNode | Function; title: string; className?: string }> = memo(({ Content, title, className }) => {
  useCloseOnRouterBack(DrawerPopup.hide);
  const hasInit = useRef(false);
  const account = useAccount();

  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      return;
    }
    DrawerPopup.hide();
  }, [account]);



  return (
    <div className={cx("px-16px p-24px pb-40px h-full", className)}>
      <div className="flex justify-between items-center text-16px text-grey-normal font-bold">
        {title ?? 'title'}
        <span className="i-ep:close-bold text-24px text-green-normal cursor-pointer" onClick={() => DrawerPopup.hide()} />
      </div>
      <div className="mt-16px h-1px bg-#6667ab4c pointer-events-none" />

      {renderReactNode(Content)}
    </div>
  );
});

export const showDrawer = (props: { Content: React.ReactNode, title: string; }) => DrawerPopup.show(<Drawer {...props} />);

export const hideDrawer = () => DrawerPopup.hide();
export const hideAllDawer = () => DrawerPopup.hide();
