import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from '@components/Button';
import { useAccount } from '@service/account';
import { useClearRegisterInfoWhenAccountChange } from '@service/domainRegister';
import StatusSearch from '@modules/StatusSearch';
import { shortenAddress } from '@utils/addressUtils';
import isMobile from '@utils/isMobie';
import Account from './Account';
import showAccountConnector from './AccountConnector';

const Navbar: React.FC = () => {
  const account = useAccount();
  const { pathname } = useLocation();
  useClearRegisterInfoWhenAccountChange(account);

  return (
    <header className="relative flex items-center h-84px pt-36px text-grey-normal whitespace-nowrap z-100 lt-md:h-58px lt-md:pt-16px">
      <nav className="left-1/2 -translate-x-1/2 absolute bottom-0 flex items-center w-full max-w-1232px leading-48px lt-xl:px-24px">
        <Link to="/" className="mr-auto text-grey-normal no-underline">
          <span>
            <span className="i-bi:box-fill mr-14px text-48px flex-shrink-0 lt-md:text-32px" />
            {!isMobile() && <span className="text-28px font-bold">SHUTU</span>}
          </span>
        </Link>

        {pathname !== '/' && !isMobile() && <StatusSearch where="header" className="mr-24px"/>}
        {!account && <Button onClick={showAccountConnector}>连接</Button>}
        {account && (
          <>
            {!isMobile() && <span className="mr-10px text-16px text-#AAA9C1">{shortenAddress(account)}</span>}
            <Account account={account}/>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
