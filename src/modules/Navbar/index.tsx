import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from '@components/Button';
import { useAccount } from '@service/account';
import { useClearRegisterInfoWhenAccountChange } from '@service/domainRegister';
import StatusSearch from '@modules/StatusSearch';
import CfxAddress from '@modules/CfxAddress';
import Account from './Account';
import showAccountConnector from './AccountConnector';

const Navbar: React.FC = () => {
  const account = useAccount();
  const { pathname } = useLocation();
  useClearRegisterInfoWhenAccountChange(account);

  return (
    <header className="relative flex items-center h-84px pt-36px text-grey-normal whitespace-nowrap z-100 lt-md:h-56px lt-md:pt-16px">
      <nav className="left-1/2 -translate-x-1/2 absolute bottom-0 flex items-center w-full max-w-1232px leading-48px lt-md:leading-40px lt-xl:px-24px lt-md:px-12px lt-mini:px-0px">
        <Link to="/" className="mr-auto flex items-center text-grey-normal no-underline">
          <span className="i-bi:box-fill text-48px flex-shrink-0 lt-md:text-32px" />
          <span className="ml-14px text-28px leading-32px font-bold lt-mini:display-none">SHUTU</span>
        </Link>

        {pathname !== '/' && <StatusSearch where="header" className="mr-24px lt-md:display-none" />}
        {!account && <Button onClick={showAccountConnector}>连接</Button>}
        {account && (
          <>
            <CfxAddress address={account} className="mr-10px text-16px text-#AAA9C1 leading-18px" />
            <Account account={account} />
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
