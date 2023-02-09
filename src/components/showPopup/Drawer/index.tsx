import React, { memo, useEffect, useCallback, useRef, type ReactNode } from 'react';
import cx from 'clsx';
import { useAccount } from '@service/account';
import { DrawerClass } from '@components/Drawer';
import renderReactNode from '@utils/renderReactNode';
import useCloseOnRouterBack from '../useCloseOnRouterBack';
import { recordCurrentPopup } from '../';

export const DrawerPopup = new DrawerClass(true);

const Drawer: React.FC<{ Content: ReactNode | Function; title: string; className?: string; onClose?: VoidFunction }> = memo(({ Content, title, className, onClose }) => {
  const account = useAccount();

  const hasInit = useRef(false);
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      return;
    }
    history.back();
  }, [account]);

  const handleClose = useCallback(() => {
    DrawerPopup.hide();
    onClose?.();
  }, [onClose]);

  useCloseOnRouterBack(handleClose);

  return (
    <div className={cx('px-16px p-24px pb-40px h-full', className)}>
      <div className="flex justify-between items-center text-16px text-grey-normal font-bold">
        {title ?? 'title'}
        <span className="i-ep:close-bold text-24px text-green-normal cursor-pointer" onClick={() => history.back()} />
      </div>
      <div className="mt-16px h-1px bg-#6667ab4c pointer-events-none" />

      {renderReactNode(Content)}
    </div>
  );
});

export const showDrawer = (props: { Content: React.ReactNode; title: string; onClose?: VoidFunction }) => {
  const popupId = DrawerPopup.show(<Drawer {...props} />);
  recordCurrentPopup(popupId);
  return popupId;
};

export const hideDrawer = () => DrawerPopup.hide();
export const hideAllDawer = () => DrawerPopup.hide();
