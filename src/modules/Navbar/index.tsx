import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from '@components/Button';
import { useAccount } from '@service/account';
import { useClearRegisterInfoWhenAccountChange } from '@service/domainRegister';
import StatusSearch from '@modules/StatusSearch';
import { shortenAddress } from '@utils/addressUtils';
import Account from './Account';
import showAccountConnector from './AccountConnector';

const Navbar: React.FC = () => {
  const account = useAccount();
  const { pathname } = useLocation();
  useClearRegisterInfoWhenAccountChange(account);

  return (
    <header className="relative flex items-center h-88px pt-40px text-grey-normal whitespace-nowrap z-100">
      <nav className="left-1/2 -translate-x-1/2 absolute bottom-0 flex items-center w-full max-w-1232px leading-48px lt-xl:px-24px">
        <Link to="/" className="mr-auto text-grey-normal no-underline">
          <span>
            <span className="i-bi:box-fill mr-14px text-48px flex-shrink-0" />
            <span className="text-28px font-bold">SHUTU</span>
          </span>
        </Link>

        {pathname !== '/' && <StatusSearch where="header" className="mr-24px"/>}
        {!account && <Button onClick={showAccountConnector}>连接</Button>}
        {account && (
          <>
            <span className="mr-10px text-16px text-#AAA9C1">{shortenAddress(account)}</span>
            <Account />
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
