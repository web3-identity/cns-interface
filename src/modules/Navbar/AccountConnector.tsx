import React, { useCallback, type ComponentProps } from 'react';
import { showModal, showDrawer, hideModal, hideDrawer } from '@components/showPopup';
import fluentImg from '@assets/icons/fluent.svg';
import anywebImg from '@assets/icons/anyweb.svg';
import cellarImg from '@assets/icons/cellar.png';
import { connect } from '@service/account';
import isMobile from '@utils/isMobie';

let connectorId: string | null = null;

const ConnectWallet: React.FC<ComponentProps<'div'> & { icon: string; name: string; connect: () => Promise<void> }> = ({ children, connect, icon, name }) => {
  const handleClick = useCallback(async () => {
    try {
      await connect();
      if (connectorId) {
        hideModal(connectorId);
        hideDrawer();
        connectorId = null;
      }
    } catch (err) {}
  }, [connect]);

  return (
    <div onClick={handleClick} className="flex flex-col items-center justify-center w-100px h-100px rounded-8px hover:bg-#26233E transition-colors cursor-pointer">
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
      <ConnectWallet connect={() => connect('cellar')} icon={cellarImg} name="Cellar" />
    </div>
  );
};


const showAccountConnector = () => {
  if (isMobile()) {
    connectorId = showDrawer({ Content: <ConnectModalContent />, title: '连接钱包' });
  } else {
    connectorId = showModal({ Content: <ConnectModalContent />, className: '!max-w-370px', title: '连接钱包' }) as string;
  }
};

export default showAccountConnector;
