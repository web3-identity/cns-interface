import React, { type ComponentProps } from 'react';
import { showModal, showDrawer } from '@components/showPopup';
import fluentImg from '@assets/icons/fluent.svg';
import anywebImg from '@assets/icons/anyweb.svg';
import { connect } from '@service/account';
import isMobile from '@utils/isMobie';

const ConnectWallet: React.FC<ComponentProps<'div'> & { icon: string; name: string }> = ({ children, onClick, icon, name }) => {
  return (
    <div onClick={onClick} className="flex flex-col items-center justify-center w-100px h-100px rounded-8px hover:bg-#26233E transition-colors cursor-pointer">
      {children}
      <img className="w-24px h-24px mb-12px" src={icon} />
      <span className="text-14px text-grey-normal">{name}</span>
    </div>
  );
};

const ConnectModalContent: React.FC = () => {
  return (
    <div className="flex items-center justify-evently gap-12px pt-24px lt-md:justify-center">
      <ConnectWallet onClick={() => connect('fluent')} icon={fluentImg} name="Fluent" />
      <ConnectWallet onClick={() => connect('anyweb')} icon={anywebImg} name="AnyWeb" />
    </div>
  );
};

const showAccountConnector = () => {
  if (isMobile()) {
    showDrawer({ Content: <ConnectModalContent />, title: '连接钱包' });
  } else {
    showModal({ Content: <ConnectModalContent />, className: '!max-w-370px', title: '连接钱包' });
  }
};

export default showAccountConnector;
