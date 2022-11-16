import React, { useCallback, type ComponentProps } from 'react';
import cx from 'clsx';
import { useLocation, Link } from 'react-router-dom';
import Dropdown from '@components/Dropdown';
import Avatar from '@components/Avatar';
import isMobile from '@utils/isMobie';
import { disconnect, useAccountMethod } from '@service/account';
import { usePrefetchMyDomains } from '@service/myDomains';
import { usePrefetchDomainReverseRegistrar } from '@service/domainReverseRegistrar';
import { throttle } from 'lodash-es';

const AccountDropdownItem: React.FC<ComponentProps<'div'> & { isCurrent?: boolean }> = ({ children, isCurrent, onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={cx(
        'w-160px h-48px leading-48px rounded-8px text-center hover:bg-purple-dark-active transition-colors lt-md:w-120px lt-md:h-40px select-none',
        isCurrent ? 'bg-purple-dark-active' : 'cursor-pointer'
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const AccountDropdown: React.FC = () => {
  const accountMethod = useAccountMethod();
  const { pathname } = useLocation();
  
  const prefetchMyDomains = usePrefetchMyDomains();
  const prefetchDomainReverseRegistrar = usePrefetchDomainReverseRegistrar();
  const prefetchData = useCallback(throttle(() => {
    prefetchMyDomains();
    prefetchDomainReverseRegistrar();
  }, 10000), []);

  return (
    <div className="mt-8px flex flex-col gap-16px p-24px rounded-24px bg-#26233E text-grey-normal text-14px font-bold dropdown-shadow lt-md:mt-16px lt-md:p-16px">
      <Link to="/my-domains" className="text-white no-underline cursor-default" draggable="false" onMouseEnter={prefetchData}>
        <AccountDropdownItem isCurrent={pathname?.startsWith('/my-domains')}>域名管理</AccountDropdownItem>
      </Link>
      <AccountDropdownItem onClick={() => disconnect(accountMethod!)}>退出登录</AccountDropdownItem>
    </div>
  );
};

const size = !isMobile() ? 48 : 32;
const Account: React.FC<{ account: string }> = ({ account }) => {
  return (
    <Dropdown placement="bottom" trigger="mouseenter" interactiveDebounce={50} delay={[100, 0]} Content={<AccountDropdown />} hideOnClick={false} sameWidth={false}>
      <span className="flex-shrink-0 cursor-s-resize">
        <Avatar address={account} size={size} />
      </span>
    </Dropdown>
  );
};

export default Account;
