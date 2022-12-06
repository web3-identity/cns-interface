import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useAccount } from '@service/account';
import { useClearRegisterInfoWhenAccountChange } from '@service/domainRegister';
import AuthConnectButton from '@modules/AuthConnectButton';
import StatusSearch from '@modules/StatusSearch';
import CfxAddress from '@modules/CfxAddress';
import Account from './Account';
import { ReactComponent as Logo } from '@assets/icons/logo.svg';

const Navbar: React.FC = () => {
  const account = useAccount();
  const { pathname } = useLocation();
  useClearRegisterInfoWhenAccountChange(account);

  return (
    <header className="relative flex flex-col justify-end items-center h-84px pt-36px text-grey-normal whitespace-nowrap z-100 lt-md:h-56px lt-md:pt-16px">
      <nav className="flex items-center w-full max-w-1232px lt-md:h-40px lt-xl:px-24px lt-md:px-12px lt-tiny:px-6px">
        <NavLink to="/" className="mr-auto flex items-center text-grey-normal no-underline" style={({ isActive }) => ({ pointerEvents: isActive ? 'none' : undefined })}>
          <Logo className="w-48px h-48px flex-shrink-0 lt-md:w-32px lt-md:h-32px" />
          <span className="ml-14px lt-md:ml-10px text-28px leading-48px lt-md:leading-32px lt-md:text-22px font-[Outfit] font-extrabold lt-mini:display-none">.WEB3</span>
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
