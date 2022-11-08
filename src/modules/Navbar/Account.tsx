import React, { type HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '@components/Dropdown';
import Avatar from '@components/Avatar';
import isMobile from '@utils/isMobie';
import { disconnect } from '@service/account';

const AccountDropdownItem: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="w-160px h-48px leading-48px rounded-8px text-center hover:bg-purple-dark-active transition-colors cursor-pointer">
      {children}
    </div>
  );
};

const AccountDropdown: React.FC = () => {
  return (
    <div className="mt-24px flex flex-col gap-16px p-24px rounded-24px bg-#26233E text-grey-normal text-14px font-bold dropdown-shadow">
      <Link to="/my-domains" className="text-white no-underline">
        <AccountDropdownItem>域名管理</AccountDropdownItem>
      </Link>
      <AccountDropdownItem onClick={disconnect}>退出登录</AccountDropdownItem>
    </div>
  );
};

const size = !isMobile() ? 48 : 32
const Account: React.FC<{ account: string; }> = ({ account }) => {
  return (
    <Dropdown placement="bottom-start" trigger="click" interactiveDebounce={100} Content={<AccountDropdown />}>
      <span className="flex-shrink-0 cursor-pointer">
        <Avatar address={account} size={size} />
      </span>
    </Dropdown>
  );
};

export default Account;
