import React, { memo, useMemo, Suspense, type ComponentProps } from 'react';
import cx from 'clsx';
import useClipboard from 'react-use-clipboard';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import Spin from '@components/Spin';
import Delay from '@components/Delay';
import Domain from '@modules/Domain';
import ToolTip from '@components/Tooltip';
import { shortenAddress } from '@utils/addressUtils';
import { useIsOwner, useDomainOwner, useDomainExpire } from '@service/domainInfo';
import showDomainTransferModal from './DomainTransferModal';
import './index.css';

const DomainCard: React.FC<{ domain: string }> = ({ domain }) => {
  const isOwner = useIsOwner(domain);

  return (
    <div className="flex gap-16px p-16px rounded-16px bg-purple-dark-active dropdown-shadow">
      <div className="flex flex-col justify-between w-200px h-200px px-10px py-16px text-purple-dark-active domain-card">
        <span className="i-bi:box-fill mr-14px text-30px flex-shrink-0" />
        <SplitDomain className="w-full break-words text-right text-22px font-bold" domain={domain} />
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <div className="relative flex items-center h-28px">
          <span className="text-14px text-grey-normal-hover text-opacity-50">注册人</span>
          <Suspense fallback={<Loading />}>
            <DomainOwner domain={domain} />
          </Suspense>

          {isOwner && (
            <Button
              className="ml-auto"
              size="mini"
              onClick={() => {
                showDomainTransferModal({ domain });
              }}
            >
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

export default DomainCard;


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

const SplitDomain: React.FC<ComponentProps<'span'> & { domain: string }> = memo(({ domain, className, ...props }) => {
  const splitDomains = useMemo(() => {
    let _domain = Array.from(domain + '.web3').reverse();
    const res: Array<string> = [];
    while (_domain.length && res.length < 4) {
      if (_domain.length === 1) {
        res[res.length - 1] = _domain[0] + res[res.length - 1];
      } else {
        res.push(_domain.slice(0, 14).reverse().join(''));
      }
      _domain = _domain.slice(14);
    }
    if (_domain.length) {
      res.push(_domain.reverse().join(''));
    }
    return res;
  }, [domain]);

  return (
    <ToolTip disabled={splitDomains.length <= 4} text={`${domain}.web3`}>
      <span className={cx('inline-flex flex-wrap-reverse justify-end', className)} {...props}>
        {splitDomains.map((split, index) =>
          splitDomains.length > 4 && index === splitDomains.length - 1 ? (
            <Domain key={split} domain={split} suffix={false} useTooltip={false} ellipsisLength={14} />
          ) : (
            <span key={split}>{split}</span>
          )
        )}
      </span>
    </ToolTip>
  );
});