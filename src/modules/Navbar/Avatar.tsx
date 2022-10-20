import React, { type HTMLAttributes } from 'react';
import { disconnect } from '@service/account';
import Dropdown from '@components/Dropdown';
import { ReactComponent as AvatarIcon } from '@assets/images/Avatar.svg';

const AvatarDropdownItem: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="w-230px h-50px leading-48px rounded-8px text-center hover:bg-purple-dark-active transition-colors cursor-pointer">
      {children}
    </div>
  );
};

const AvatarDropdown: React.FC = () => {
  return (
    <div className="mt-24px flex flex-col gap-16px p-24px rounded-24px bg-#26233E text-grey-normal text-14px font-bold dropdown-shadow">
      <AvatarDropdownItem>域名管理</AvatarDropdownItem>
      <AvatarDropdownItem onClick={disconnect}>退出登录</AvatarDropdownItem>
    </div>
  );
};

const Avatar: React.FC = () => {
  return (
    <Dropdown placement="bottom-start" trigger="click" interactiveDebounce={100} Content={<AvatarDropdown />}>
      <span className="w-48px h-48px flex-shrink-0 cursor-pointer">
        <AvatarIcon className="w-full h-full pointer-events-none" />
      </span>
    </Dropdown>
  );
};

export default Avatar;