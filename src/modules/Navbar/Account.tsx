import React, { useState, useCallback, type ComponentProps } from 'react';
import cx from 'clsx';
import { useLocation, Link } from 'react-router-dom';
import Dropdown from '@components/Dropdown';
import Avatar from '@components/Avatar';
import { disconnect, useAccountMethod } from '@service/account';
import { usePrefetchMydomainsPage } from '@service/prefetch';
import useIsLtMd from '@hooks/useIsLtMd';

const AccountDropdownItem: React.FC<ComponentProps<'div'> & { isCurrent?: boolean }> = ({ children, isCurrent, onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={cx(
        'w-160px h-48px leading-48px rounded-8px text-center hover:bg-purple-dark-active transition-colors lt-md:w-120px lt-md:h-40px lt-md:leading-40px select-none',
        isCurrent ? 'bg-purple-dark-active' : 'cursor-pointer'
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const AccountDropdown: React.FC<{ hideDropdown: VoidFunction }> = ({ hideDropdown }) => {
  const accountMethod = useAccountMethod();
  const { pathname } = useLocation();

  return (
    <div className="mt-8px flex flex-col gap-16px p-24px rounded-24px bg-#26233E text-grey-normal text-14px font-bold dropdown-shadow lt-md:mt-4px lt-md:p-16px">
      <Link to="/my-domains" className="text-white no-underline cursor-default" draggable="false" onClick={hideDropdown}>
        <AccountDropdownItem isCurrent={pathname?.startsWith('/my-domains')}>域名管理</AccountDropdownItem>
      </Link>
      <AccountDropdownItem
        onClick={() => {
          disconnect(accountMethod!);
          hideDropdown();
        }}
      >
        退出登录
      </AccountDropdownItem>
    </div>
  );
};

const Account: React.FC<{ account: string }> = ({ account }) => {
  const isLtMd = useIsLtMd();
  const prefetchMydomainsPage = usePrefetchMydomainsPage();

  const [visible, setVisible] = useState(false);
  const showDropdown = useCallback(() => {
    setVisible(true);
    prefetchMydomainsPage();
  }, []);
  const hideDropdown = useCallback(() => setVisible(false), []);

  return (
    <Dropdown placement="bottom" visible={visible} Content={<AccountDropdown hideDropdown={hideDropdown} />} sameWidth={false} onClickOutside={hideDropdown}>
      <Avatar className="flex-shrink-0 cursor-pointer" onClick={showDropdown} address={account} size={isLtMd ? 32 : 48} />
    </Dropdown>
  );
};

export default Account;
