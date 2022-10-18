import React from 'react';
import cx from 'clsx';
import Button from '@components/Button';
import Dropdown from '@components/Dropdown';
import { showModal } from '@components/showPopup/Modal';
import { useAccount, connect, disconnect } from '@service/account';
import fluentImg from '@assets/icons/fluent.svg';
import anywebImg from '@assets/icons/anyweb.svg';
import { ReactComponent as AvatarIcon } from '@assets/images/Avatar.svg';

const Navbar: React.FC = () => {
  const account = useAccount();
  return (
    <header className="relative flex items-center h-88px pt-40px text-grey-normal">
      <nav className={cx('max-w-1920px mx-auto absolute bottom-0 flex w-full px-32px leading-48px')}>
        <span className="i-bi:box-fill mr-14px text-48px flex-shrink-0" />
        <span className="mr-auto text-28px font-bold">SHUTU</span>
        {!account && <Button onClick={showConnectModal}>连接</Button>}
        {account && (
          <>
            <span className="mr-12px">{account}</span>
            <Avatar />
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

interface ConnectWalletProps {
  children?: React.ReactElement<any>;
  onClick?: (ev: any) => void;
  icon?: string;
  name?: string;
}
const ConnectWallet: React.FC<ConnectWalletProps> = ({ children, onClick, icon, name }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center w-100px h-97px cursor-pointer rounded-8px bg-transparent hover:bg-#26233E mr-11px;
    "
    >
      {children}
      <img className="w-24px h-24px mb-12px" src={icon} />
      <span className="text-14px text-#F0EEE9">{name}</span>
    </div>
  );
};

// Connect Method Modal
const ConnectModalContent: React.FC = () => {
  return (
    <div className="flex items-center justify-evently pt-24px">
      <ConnectWallet onClick={() => connect('fluent')} icon={fluentImg} name="Fluent" />
      <ConnectWallet onClick={() => connect('anyweb')} icon={anywebImg} name="AnyWeb" />
    </div>
  );
};

const showConnectModal = () => showModal({ Content: <ConnectModalContent />, className: '!max-w-370px', title: '连接钱包' });

interface AvatarDropdownItemProps {
  children: React.ReactElement<any> | string;
  onClick?: (ev: any) => void;
}

const AvatarDropdownItem: React.FC<AvatarDropdownItemProps> = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="w-232px h-49px flex items-center justify-center rounded-8px bg-transparent hover:bg-#2E2E4D mb-16px">
      {children}
    </div>
  );
};

// Avatar
const AvatarDropdown: React.FC = () => {
  return (
    <div className="w-280px h-162px rounded-8px bg-#26233E text-#F0EEE9 dropdown-shadow text-16px font-semibold no-underline overflow-hidden flex flex-col items-center pt-24px mt-24px">
      <AvatarDropdownItem>域名管理</AvatarDropdownItem>
      <AvatarDropdownItem onClick={disconnect}>退出登录</AvatarDropdownItem>
    </div>
  );
};

const Avatar: React.FC = () => {
  return (
    <Dropdown placement="bottom-start" trigger="mouseenter click" interactiveDebounce={100} Content={<AvatarDropdown />}>
      <span className="w-48px h-48px flex-shrink-0">
        <AvatarIcon className="w-full h-full" />
      </span>
    </Dropdown>
  );
};
