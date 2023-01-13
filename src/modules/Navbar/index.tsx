import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import cx from 'clsx';
import { useAccount } from '@service/account';
import { useClearRegisterInfoWhenAccountChange } from '@service/domainRegister';
import AuthConnectButton from '@modules/AuthConnectButton';
import StatusSearch from '@modules/StatusSearch';
import CfxAddress from '@modules/CfxAddress';
import { useMainScrollerDistance } from '@hooks/useMainScroller';
import Account from './Account';
import { ReactComponent as Logo } from '@assets/icons/logo.svg';

const Navbar: React.FC = () => {
  const account = useAccount();
  const { pathname } = useLocation();
  useClearRegisterInfoWhenAccountChange(account);
  const mainScrollerDistance = useMainScrollerDistance();

  return (
    <header className={cx("relative flex flex-col justify-center items-center h-116px text-grey-normal whitespace-nowrap z-100 lt-md:h-80px transition-colors", mainScrollerDistance > 1 && 'bg-#110F1B')}>
      <nav className="flex items-center w-full xl:max-w-1232px lt-xl:px-24px lt-md:px-12px lt-tiny:px-6px">
        <NavLink to="/" className="mr-auto flex items-center text-grey-normal no-underline" style={({ isActive }) => ({ pointerEvents: isActive ? 'none' : undefined })}>
          <Logo className="w-54px h-54px flex-shrink-0 lt-md:w-32px lt-md:h-32px" />
          <span className="ml-7px lt-md:ml-4px text-28px lt-md:text-16.6px translate-y-5px lt-md:translate-y-3px font-[Outfit] font-extrabold lt-mini:display-none">.WEB3</span>
        </NavLink>

        {pathname !== '/' && <StatusSearch where="header" className="mr-24px lt-md:display-none" />}
        <AuthConnectButton>
          {account && (
            <>
              <CfxAddress address={account} className="mr-10px text-16px text-#AAA9C1 leading-18px" />
              <Account account={account} />
            </>
          )}
        </AuthConnectButton>
      </nav>
    </header>
  );
};

export default Navbar;
