import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import cx from 'clsx';
import Button from '@components/Button';
import { useAccount } from '@service/account';
import StatusSearch from '@modules/StatusSearch';
import { shortenAddress } from '@utils/addressUtils';
import Avatar from './Avatar';
import showAccountConnector from './AccountConnector';

const Navbar: React.FC = () => {
  const account = useAccount();
  const { pathname } = useLocation();
  
  return (
    <header className="relative flex items-center h-88px pt-40px text-grey-normal">
      <nav className={cx('mx-auto absolute bottom-0 flex w-full px-140px leading-48px')}>
        <Link to="/" className="mr-auto text-grey-normal no-underline">
          <span>
            <span className="i-bi:box-fill mr-14px text-48px flex-shrink-0" />
            <span className="text-28px font-bold">SHUTU</span>
          </span>
        </Link>

        {pathname !== '/' && <StatusSearch where="header" className="mr-28px"/>}
        {!account && <Button onClick={showAccountConnector}>连接</Button>}
        {account && (
          <>
            <span className="ml-26px mr-10px text-16px text-#AAA9C1">{shortenAddress(account)}</span>
            <Avatar />
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
