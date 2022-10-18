import React, { memo, useEffect, useRef, type ReactNode } from 'react';
import cx from 'clsx';
import { useAccount } from '@service/account';
import { PopupClass } from '@components/Popup';
import renderReactNode from '@utils/renderReactNode';
import './index.css';

export const ModalPopup = new PopupClass(true);
ModalPopup.initPromise.then(() => {
  ModalPopup.setListClassName('modal-wrapper');
  ModalPopup.setItemWrapperClassName('toast-item-wrapper');
  ModalPopup.setAnimatedSize(false);
})

const Modal: React.FC<{ Content: ReactNode | Function; title: string; className?: string }> = memo(({ Content, title, className }) => {
  const hasInit = useRef(false);
  const account = useAccount();

  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      return;
    }
    ModalPopup.hideAll();
  }, [account]);

  return (
    <div className={cx('relative w-90vw max-w-568px p-24px rounded-24px bg-purple-dark-active overflow-hidden dropdown-shadow', className)}>
      <div className="flex justify-between items-center text-22px text-grey-normal font-bold">
        {title}
        <span className="i-ep:close-bold text-24px text-green-normal cursor-pointer" onClick={ModalPopup.hideAll} />
      </div>
      <div className="mt-20px h-1px bg-#6667ab4c" />

      {renderReactNode(Content)}
    </div>
  );
});

export const showModal = ({ Content, title, className }: { Content: Function | ReactNode; title: string; className?: string }) => {
  return ModalPopup.show({
    Content: <Modal Content={Content} title={title} className={className} />,
    duration: 0,
    showMask: true,
    animationType: 'door',
    pressEscToClose: true,
  });
};

export const hideModal = (key: string | number) => ModalPopup.hide(key);
export const hideAllModal = () => ModalPopup.hideAll();
