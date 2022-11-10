import React, { Suspense } from 'react';
import useClipboard from 'react-use-clipboard';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import Spin from '@components/Spin';
import Delay from '@components/Delay';
import Domain from '@modules/Domain';
import { shortenAddress } from '@utils/addressUtils';
import { useIsOwner, useDomainOwner, useDomainExpire } from '@service/domainInfo';
import './index.css';

const DomainCard: React.FC<{ domain: string }> = ({ domain }) => {
  const isOwner = useIsOwner(domain);

  return (
    <div className="flex gap-16px p-16px rounded-16px bg-purple-dark-active dropdown-shadow">
      <div className="flex flex-col justify-between w-200px h-200px px-10px py-16px text-purple-dark-active domain-card">
        <span className="i-bi:box-fill mr-14px text-30px flex-shrink-0" />
        <Domain className="w-full whitespace-nowrap text-22px font-bold" domain={domain} />
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <div className="relative flex items-center h-28px">
          <span className="text-14px text-grey-normal-hover text-opacity-50">注册人</span>
          <Suspense fallback={<Loading />}>
            <DomainOwner domain={domain} />
          </Suspense>

          {isOwner && (
            <Button className="ml-auto" size="mini">
              转让
            </Button>
          )}
        </div>

        <div className="mt-8px relative flex items-center h-28px">
          <span className="text-14px text-grey-normal-hover text-opacity-50">到期时间</span>
          <Suspense fallback={<Loading />}>
            <DomainExpire domain={domain} />
          </Suspense>

          {isOwner && (
            <Button className="ml-auto" size="mini">
              续费
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Loading = () => (
  <Delay mode="opacity">
    <Spin className="absolute left-16px text-18px" />
  </Delay>
);

const DomainOwner: React.FC<{ domain: string }> = ({ domain }) => {
  const ownerAddress = useDomainOwner(domain);
  const [_, copy] = useClipboard(ownerAddress!);

  return (
    <div className="absolute left-66px flex items-center h-full">
      {!!ownerAddress && <Avatar address={ownerAddress} size={18} />}
      <span className="mx-8px text-grey-normal">{shortenAddress(ownerAddress)}</span>
      <span className="i-bxs:copy-alt text-20px text-#838290 cursor-pointer" onClick={copy} />
    </div>
  );
};

const DomainExpire: React.FC<{ domain: string }> = ({ domain }) => {
  const expire = useDomainExpire(domain);

  return <div className="absolute left-66px text-grey-normal">预计 {expire.dateFormatForSecond}</div>;
};

export default DomainCard;
