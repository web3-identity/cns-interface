import React, { Suspense } from 'react';
import cx from 'clsx';
import PageWrapper from '@components/Layout/PageWrapper';
import { useMyDomains } from '@service/myDomains';
import { useAccount } from '@service/account';
import { useDomainExpire } from '@service/domainInfo';
import { useDomainReverseRegistrar } from '@service/domainReverseRegistrar';
import { shortenAddress } from '@utils/addressUtils';
import { getLabelDomain } from '@utils/domainHelper';
import BorderBox from '@components/Box/BorderBox';
import Button from '@components/Button';
import Avatar from '@components/Avatar';

interface Props {
  domain: string;
  index: number;
}
const DomainItem: React.FC<Props> = ({ domain, index }) => {
  const { dateFormatForSecond, gracePeriod, isExpired } = useDomainExpire(domain);
  return (
    <>
      {index !== 0 && <div className="h-1px w-full bg-purple-normal opacity-30" />}
      <div className="flex py-24px justify-between">
        <div className="flex flex-col gap-6px">
          <span className="text-grey-normal text-22px font-bold">{getLabelDomain(domain)}</span>
          {!isExpired ? (
            <span className="text-grey-normal-hover text-opacity-50 text-14px">
              预计到期
              <span className="ml-8px text-grey-normal">{dateFormatForSecond}</span>
            </span>
          ) : (
            <span className="text-grey-normal-hover text-opacity-50 text-14px">
              域名已到期，将于<span className="text-grey-normal font-bold">{gracePeriod}</span>天后到期
            </span>
          )}
        </div>
        <div className="flex gap-60px">
          <Button variant="text">续费</Button>
          <Button>域名管理</Button>
        </div>
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
      <BorderBox variant="gradient" className="flex justify-between h-100px px-24px rounded-18px">
        <div className="flex flex-col justify-between pt-14px pb-22px text-22px font-bold text-grey-normal">
          <span className="text-grey-normal-hover text-opacity-50 text-14px leading-18px">当前账户</span>
          {!domain ? (
            <div className="flex gap-16px items-center">
              <Avatar address={account} diameter={30} />
              <span>{shortenAddress(account!)}</span>
            </div>
          ) : (
            <span>{domain}</span>
          )}
        </div>
        <div className="flex items-center">
          <Button>设置.web3域名</Button>
        </div>
      </BorderBox>
      <span className="text-grey-normal text-22px leading-26px">注册人</span>
      <div className="bg-purple-dark-active px-24px rounded-24px dropdown-shadow">
        {myDomains.map((domain: string, index: number) => (
          <DomainItem key={index} domain={domain} index={index} />
        ))}
      </div>
    </div>
  );
};

const MyDomains: React.FC = () => {
  return (
    <PageWrapper className="pt-230px">
      <Suspense fallback={null}>
        <DomainList />
      </Suspense>
    </PageWrapper>
  );
};

export default MyDomains;
