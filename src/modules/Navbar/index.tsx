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
import './index.css';

const Navbar: React.FC = () => {
  const account = useAccount();
  const { pathname } = useLocation();
  useClearRegisterInfoWhenAccountChange(account);
  const mainScrollerDistance = useMainScrollerDistance();

  return (
    <>
      <div className="notice h-120px flex flex-col justify-center items-center">
        <div className="flex items-center h-full text-center xl:max-w-1184px lt-xl:px-24px lt-md:px-12px lt-tiny:px-6px text-[#2E2E4D] text-18px lt-xl:text-16px leading-28px lt-xl:leading-24px lt-md:text-14px lt-md:leading-20px lt-mobile:text-12px lt-mobile:leading-16px">
          <span>
            为了进一步支持 Conflux 生态中「.web3」域名项目的发展，现 Conflux 网络上「.web3」域名可{' '}
            <span className="text-22px font-bold lt-md:text-16px lt-md:leading-24px w-fit">免费延期一年！</span> 若您是 Conflux
            网络上的「.web3」用户名持有者，您所持有的域名将自动延期一年，无需做任何额外操作。
          </span>
        </div>
      </div>
      <header
        className={cx(
          'relative flex flex-col justify-center items-center h-116px text-grey-normal whitespace-nowrap z-100 lt-md:h-80px transition-colors',
          mainScrollerDistance > 1 && 'bg-#110F1B'
        )}
      >
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
    </>
  );
};

export default Navbar;
