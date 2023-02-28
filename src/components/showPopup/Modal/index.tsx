import React, { memo, useCallback, useEffect, useRef, type ReactNode } from 'react';
import cx from 'clsx';
import { useAccount } from '@service/account';
import { PopupClass } from '@components/Popup';
import renderReactNode from '@utils/renderReactNode';
import usePressEsc from '@hooks/usePressEsc';
import useCloseOnRouterBack from '../useCloseOnRouterBack';
import { recordCurrentPopup } from '../';
import './index.css';

export const ModalPopup = new PopupClass(true);
ModalPopup.initPromise.then(() => {
  ModalPopup.setListClassName('modal-wrapper');
});

const Modal: React.FC<{ Content: ReactNode | Function; title: string; className?: string; onClose?: VoidFunction }> = memo(({ Content, title, className, onClose }) => {
  const account = useAccount();

  const hasInit = useRef(false);
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      return;
    }
    history.back();
  }, [account]);

  const backHistory = useCallback(() => history.back(), []);
  const handleClose = useCallback(() => {
    ModalPopup.hideAll();
    onClose?.();
  }, [onClose]);

  usePressEsc(backHistory);
  useCloseOnRouterBack(handleClose);

  return (
    <div className={cx('relative w-90vw max-w-568px p-24px rounded-24px bg-purple-dark-active overflow-hidden dropdown-shadow', className)}>
      <div className="flex justify-between items-center text-22px text-grey-normal font-bold">
        {title}
        <span className="i-ep:close-bold text-24px text-green-normal cursor-pointer" onClick={backHistory} />
      </div>
      <div className="mt-20px h-1px bg-#6667ab4c pointer-events-none" />

      {renderReactNode(Content)}
    </div>
  );
});

export const showModal = (props: { Content: Function | ReactNode; title: string; className?: string; onClose?: VoidFunction }) => {
  const popupId = ModalPopup.show({
    Content: <Modal {...props} />,
    duration: 0,
    showMask: true,
    animationType: 'door',
    pressEscToClose: true,
  });
  recordCurrentPopup(popupId);
  return popupId;
};

export const hideModal = (key: string | number) => ModalPopup.hide(key);
export const hideAllModal = () => ModalPopup.hideAll();
