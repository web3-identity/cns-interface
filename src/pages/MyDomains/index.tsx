import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '@components/Layout/PageWrapper';
import BorderBox from '@components/Box/BorderBox';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import AuthConnectButton from '@modules/AuthConnectButton';
import { useMyDomains } from '@service/myDomains';
import { useAccount } from '@service/account';
import { useDomainExpire } from '@service/domainInfo';
import { useDomainReverseRegistrar } from '@service/domainReverseRegistrar';
import { shortenAddress } from '@utils/addressUtils';
import { getLabelDomain } from '@utils/domainHelper';
import isMobile from '@utils/isMobie';

interface Props {
  domain: string;
  index: number;
}
const DomainItem: React.FC<Props> = ({ domain, index }) => {
  const { dateFormatForSecond, gracePeriod, isExpired } = useDomainExpire(domain);
  return (
    <>
      {index !== 0 && !isMobile() && <div className="h-1px w-full bg-purple-normal opacity-30" />}
      <div className="lt-md:flex lt-md:justify-between lt-md:items-center lt-md:rounded-12px lt-md:px-16px lt-md:bg-purple-dark-active">
        <div className="flex py-24px justify-between lt-md:flex-col lt-md:py-16px">
          <div className="flex flex-col gap-6px lt-md:gap-8px">
            <span className="text-grey-normal text-22px font-bold lt-md:text-16px lt-md:leading-18px">{getLabelDomain(domain)}</span>

            <span className="text-grey-normal-hover text-opacity-50 text-14px lt-md:text-12px ;t-md:leading-14px">
              {!isExpired ? (
                <>
                  预计到期
                  <span className="ml-8px text-grey-normal lt-md:ml-4px">{dateFormatForSecond}</span>
                </>
              ) : (
                <>
                  域名已到期，将于<span className="text-grey-normal font-bold">{gracePeriod}</span>天后到期
                </>
              )}
            </span>
          </div>
          {!isMobile() && (
            <div className="flex gap-60px lt-md:gap-6px lt-md:mt-16px">
              <Button variant="text">续费</Button>
              <Link to={`/setting/${domain}`} className="no-underline">
                <Button>域名管理</Button>
              </Link>
            </div>
          )}
        </div>
        <Link to={`/setting/${domain}`}>{isMobile() && <span className="i-dashicons:arrow-right-alt2 text-24px text-grey-normal" />}</Link>
      </div>
    </>
  );
};

const DomainList: React.FC = () => {
  const myDomains = useMyDomains();
  const account = useAccount();
  const domain = useDomainReverseRegistrar();

  return (
    <div className="flex flex-col gap-16px">
      <BorderBox variant="gradient" className="flex justify-between h-100px px-24px rounded-18px lt-md:p-16px lt-md:flex-col lt-md:h-auto">
        <div className="flex flex-col justify-between pt-14px pb-22px text-22px font-bold text-grey-normal lt-md:py-0px lt-md:text-16px lt-md:leading-18px">
          <span className="text-grey-normal-hover text-opacity-50 text-14px leading-18px lt-md:text-12px lt-md:leading-14px">当前账户</span>
          {!domain ? (
            <div className="flex gap-16px items-center lt-md:gap-4px lt-md:mt-2px">
              {account && <Avatar address={account} size={30} />}
              <span>{shortenAddress(account)}</span>
            </div>
          ) : (
            <span className="lt-md:inline-block lt-md:mt-4px">{domain}</span>
          )}
        </div>
        <div className="flex items-center lt-md:mt-16px">
          <Button fullWidth={isMobile()}>设置.web3域名</Button>
        </div>
      </BorderBox>
      <span className="text-grey-normal text-22px leading-26px lt-md:text-16px lt-md:leading-18px">注册人</span>
      <div className="bg-purple-dark-active px-24px rounded-24px dropdown-shadow lt-md:px-0px lt-md:rounded-none lt-md:bg-transparent lt-md:flex lt-md:flex-col lt-md:gap-16px">
        {myDomains.map((domain: string, index: number) => (
          <DomainItem key={index} domain={domain} index={index} />
        ))}
      </div>
    </div>
  );
};

const MyDomains: React.FC = () => {
  return (
    <PageWrapper className="pt-80px lt-md:pt-16px">
      <AuthConnectButton className='flex mx-auto mt-180px'>
        <Suspense fallback={null}>
          <DomainList />
        </Suspense>
      </AuthConnectButton>
    </PageWrapper>
  );
};

export default MyDomains;
