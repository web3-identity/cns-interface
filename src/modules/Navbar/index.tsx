import React from 'react';
import cx from 'clsx';
import Button from '@components/Button';
import Dropdown from '@components/Dropdown';
import { showModal } from '@components/showPopup/Modal';
import { useAccount, connect, disconnect } from '@service/account';
import { ReactComponent as AvatarIcon } from '@assets/imgs/Avatar.svg';

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
            <span className='mr-12px'>{account}</span>
            <Avatar />
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;



// Connect Method Modal
const ConnectModalContent: React.FC = () => {
  return (
    <div className='flex items-center justify-evently pt-24px'>
      <Button onClick={() => connect('fluent')}>Fluent</Button>
      <Button onClick={() => connect('anyweb')}>Anyweb</Button>
    </div>
  );
}

const showConnectModal = () => showModal({ Content: <ConnectModalContent />, className: "!max-w-370px", title: '连接钱包' });


// Avatar
const AvatarDropdown: React.FC = () => {
  return (
    <div className="min-w-200px rounded-8px bg-white dropdown-shadow text-14px font-semibold no-underline overflow-hidden">
      <div>域名管理</div>
      <div onClick={disconnect}>退出登录</div>
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
