import React, { type HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '@components/Dropdown';
import Avatar from '@components/Avatar';
import isMobile from '@utils/isMobie';
import { disconnect, useAccountMethod } from '@service/account';

const AccountDropdownItem: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="w-160px h-48px leading-48px rounded-8px text-center hover:bg-purple-dark-active transition-colors cursor-pointer lt-md:w-120px lt-md:h-40px">
      {children}
    </div>
  );
};

const AccountDropdown: React.FC = () => {
  const accountMethod = useAccountMethod();

  return (
    <div className="mt-8px flex flex-col gap-16px p-24px rounded-24px bg-#26233E text-grey-normal text-14px font-bold dropdown-shadow lt-md:mt-16px lt-md:p-16px">
      <Link to="/my-domains" className="text-white no-underline">
        <AccountDropdownItem>域名管理</AccountDropdownItem>
      </Link>
      <AccountDropdownItem onClick={() => disconnect(accountMethod!)}>退出登录</AccountDropdownItem>
    </div>
  );
};

const size = !isMobile() ? 48 : 32;
const Account: React.FC<{ account: string }> = ({ account }) => {
  return (
    <Dropdown placement="bottom" trigger="mouseenter click" interactiveDebounce={50} delay={180} Content={<AccountDropdown />} >
      <span className="flex-shrink-0 cursor-pointer">
        <Avatar address={account} size={size} />
      </span>
    </Dropdown>
  );
};

export default Account;
