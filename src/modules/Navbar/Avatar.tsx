import React, { type HTMLAttributes } from 'react';
import { disconnect } from '@service/account';
import Dropdown from '@components/Dropdown';
import { useAccount } from '@service/account';
import renderReactNode from '@utils/renderReactNode';
import { addressToNumber } from '@utils/addressUtils';


const AvatarDropdownItem: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="w-160px h-48px leading-48px rounded-8px text-center hover:bg-purple-dark-active transition-colors cursor-pointer">
      {children}
    </div>
  );
};

const AvatarIcon: React.FC<HTMLAttributes<HTMLDivElement> & { address: string | null | undefined; diameter: number }> = ({ address, diameter }) => {
  const renderAddress = addressToNumber(address);
  return (
    <div className="w-160px h-48px leading-48px rounded-8px text-center hover:bg-purple-dark-active transition-colors cursor-pointer">
      {/* {renderReactNode(jazzicon(diameter, renderAddress))} */}
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
  const address = useAccount();
  return (
    <Dropdown placement="bottom-start" trigger="click" interactiveDebounce={100} Content={<AvatarDropdown />}>
      <span className="w-48px h-48px flex-shrink-0 cursor-pointer">
        <AvatarIcon address={address} diameter={48} />
      </span>
    </Dropdown>
  );
};

export default Avatar;
