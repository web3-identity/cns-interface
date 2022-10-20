import React, { type HTMLAttributes } from 'react';
import { useLocation, Link } from 'react-router-dom';
import cx from 'clsx';
import Button from '@components/Button';
import Dropdown from '@components/Dropdown';
import { showModal } from '@components/showPopup/Modal';
import { useAccount, connect, disconnect } from '@service/account';
import StatusSearch from '@modules/StatusSearch';
import fluentImg from '@assets/icons/fluent.svg';
import anywebImg from '@assets/icons/anyweb.svg';
import { ReactComponent as AvatarIcon } from '@assets/images/Avatar.svg';

const Navbar: React.FC = () => {
  const account = useAccount();
  const { pathname } = useLocation();

  return (
    <header className="relative flex items-center h-88px pt-40px text-grey-normal">
      <nav className={cx('max-w-1920px mx-auto absolute bottom-0 flex w-full px-32px leading-48px')}>
        <Link to="/" className="mr-auto text-grey-normal no-underline">
          <span>
            <span className="i-bi:box-fill mr-14px text-48px flex-shrink-0" />
            <span className="text-28px font-bold">SHUTU</span>
          </span>
        </Link>

        {pathname !== '/' && <StatusSearch where="header" className="mr-16px" />}
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


const ConnectWallet: React.FC<HTMLAttributes<HTMLDivElement> & { icon: string; name: string; }> = ({ children, onClick, icon, name }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center w-100px h-100px rounded-8px hover:bg-#26233E transition-color cursor-pointer"
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
    <div className="flex items-center justify-evently gap-12px pt-24px">
      <ConnectWallet onClick={() => connect('fluent')} icon={fluentImg} name="Fluent" />
      <ConnectWallet onClick={() => connect('anyweb')} icon={anywebImg} name="AnyWeb" />
    </div>
  );
};  

const showConnectModal = () => showModal({ Content: <ConnectModalContent />, className: '!max-w-370px', title: '连接钱包' });


const AvatarDropdownItem: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="w-160px h-48px leading-48px rounded-8px text-center hover:bg-purple-dark-active transition-color cursor-pointer">
      {children}
    </div>
  );
};

const AvatarDropdown: React.FC = () => {
  return (
    <div className="mt-24px p-24px rounded-24px bg-#26233E text-grey-normal text-14px font-bold dropdown-shadow">
      <AvatarDropdownItem>域名管理</AvatarDropdownItem>
      <AvatarDropdownItem onClick={disconnect}>退出登录</AvatarDropdownItem>
    </div>
  );
};

const Avatar: React.FC = () => {
  return (
    <Dropdown placement="bottom-start" trigger="click" interactiveDebounce={100} Content={<AvatarDropdown />}>
      <span className="w-48px h-48px flex-shrink-0 cursor-pointer">
        <AvatarIcon className="w-full h-full" />
      </span>
    </Dropdown>
  );
};
