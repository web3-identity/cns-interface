import React, { type ComponentProps } from 'react';
import { showModal, showDrawer, hideAllModal, hideAllToast } from '@components/showPopup';
import fluentImg from '@assets/icons/fluent.svg';
import anywebImg from '@assets/icons/anyweb.svg';
import { connect } from '@service/account';
import isMobile from '@utils/isMobie';

const ConnectWallet: React.FC<ComponentProps<'div'> & { icon: string; name: string; connect: () => Promise<void> }> = ({ children, connect, icon, name }) => {
  return (
    <div
      onClick={async () => {
        try {
          await connect();
          if (name === 'Cellar') {
            hideAllModal();
            hideAllToast();
            history.back();
          }
        } catch (_) {}
      }}
      className="flex flex-col items-center justify-center w-100px h-100px rounded-8px hover:bg-#26233E transition-colors cursor-pointer"
    >
      {children}
      <img className="w-30px h-30px mb-8px" src={icon} />
      <span className="text-14px text-grey-normal">{name}</span>
    </div>
  );
};

const ConnectModalContent: React.FC = () => {
  return (
    <div className="flex justify-center items-center gap-20px pt-20px pb-22px lt-md:justify-center">
      <ConnectWallet connect={() => connect('fluent')} icon={fluentImg} name="Fluent" />
      <ConnectWallet connect={() => connect('anyweb')} icon={anywebImg} name="AnyWeb" />
      <ConnectWallet connect={() => connect('cellar')} icon="https://file.maytek.cn/20230110/cellar/4dbfea68b5/logo_20230110100227A001.png" name="Cellar" />
    </div>
  );
};

const showAccountConnector = () => {
  if (isMobile()) {
    showDrawer({ Content: <ConnectModalContent />, title: '连接钱包' });
  } else {
    showModal({ Content: <ConnectModalContent />, className: '!max-w-370px', title: '连接钱包' }) as string;
  }
};

export default showAccountConnector;
