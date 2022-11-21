import React, { memo, useMemo, Suspense, type ComponentProps } from 'react';
import cx from 'clsx';
import useClipboard from 'react-use-clipboard';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import Spin from '@components/Spin';
import Delay from '@components/Delay';
import Domain from '@modules/Domain';
import ToolTip from '@components/Tooltip';
import CfxAddress from '@modules/CfxAddress';
import { useIsOwner, useDomainOwner, useDomainExpire } from '@service/domainInfo';
import useIsLtMd from '@hooks/useIsLtMd';
import showDomainTransferModal from './DomainTransferModal';
import './index.css';

const DomainCard: React.FC<{ domain: string }> = ({ domain }) => {
  const isLtMd = useIsLtMd();
  const isOwner = useIsOwner(domain);

  return (
    <div className="flex lt-md:flex-col gap-16px p-16px rounded-16px bg-purple-dark-active dropdown-shadow">
      <div className="flex flex-col justify-between w-200px h-200px px-10px py-16px lt-md:w-120px lt-md:h-120px lt-md:px-6px lt-md:py-8px text-purple-dark-active domain-card">
        <span className="i-bi:box-fill mr-14px text-30px flex-shrink-0 lt-md:text-18px" />
        <SplitDomain className="w-full break-words text-right text-22px font-bold lt-md:text-18px" domain={domain} isLtMd={isLtMd} />
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <div className="relative flex items-center h-28px lt-md:h-40px">
          <span className="text-14px lt-md:text-12px text-grey-normal-hover text-opacity-50 lt-md:self-start">注册人</span>
          <Suspense fallback={<Loading />}>
            <DomainOwner domain={domain} />
          </Suspense>

          {isOwner && (
            <Button
              className="ml-auto lt-md:self-end"
              size="mini"
              onClick={() => {
                showDomainTransferModal({ domain });
              }}
            >
              转让
            </Button>
          )}
        </div>

        <div className="mt-8px lt-md:mt-16px relative flex items-center h-28px lt-md:h-40px">
          <span className="text-14px lt-md:text-12px text-grey-normal-hover text-opacity-50 lt-md:self-start">到期时间</span>
          <Suspense fallback={<Loading />}>
            <DomainExpire domain={domain} />
          </Suspense>

          <Button className="ml-auto lt-md:self-end" size="mini">
            续费
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DomainCard;

const Loading = () => (
  <Delay mode="opacity">
    <Spin className="!lt-md:absolute left-16px text-18px lt-md:left-0 lt-md:bottom-0" />
  </Delay>
);

const DomainOwner: React.FC<{ domain: string }> = ({ domain }) => {
  const ownerAddress = useDomainOwner(domain);
  const [isCopied, copy] = useClipboard(ownerAddress ?? '', { successDuration: 1000 });

  return (
    <div className="absolute left-66px flex items-center h-full lt-md:h-fit lt-md:left-0 lt-md:bottom-0px">
      {ownerAddress && (
        <>
          <Avatar address={ownerAddress} size={18} />
          <CfxAddress className="mx-8px lt-md:mx-4px text-14px lt-md:text-16px text-grey-normal" address={ownerAddress} />
          <ToolTip visible={isCopied} text="复制成功">
            <span className="i-bxs:copy-alt text-20px lt-md:text-16px text-#838290 cursor-pointer" onClick={copy} />
          </ToolTip>
        </>
      )}
    </div>
  );
};

const DomainExpire: React.FC<{ domain: string }> = ({ domain }) => {
  const expire = useDomainExpire(domain);

  return <div className="absolute left-66px lt-md:left-0 lt-md:bottom-0px text-14px lt-md:text-16px text-grey-normal">预计 {expire.dateFormatForSecond}</div>;
};

const SplitDomain: React.FC<ComponentProps<'span'> & { domain: string; isLtMd: boolean }> = memo(({ domain, isLtMd, className, ...props }) => {
  const maxRows = isLtMd ? 4 : 5;
  const maxCols = isLtMd ? 10 : 14;

  const splitDomains = useMemo(() => {
    let _domain = Array.from(domain + '.web3').reverse();
    const res: Array<string> = [];
    while (_domain.length && res.length < maxRows - 1) {
      res.push(_domain.slice(0, maxCols).reverse().join(''));
      _domain = _domain.slice(maxCols);
    }
    if (_domain.length) {
      res.push(_domain.reverse().join(''));
    }
    return res;
  }, [domain, isLtMd]);

  return (
    <ToolTip disabled={splitDomains.length <= maxRows - 1} text={`${domain}.web3`}>
      <span className={cx('inline-flex flex-wrap-reverse justify-end', className)} {...props}>
        {splitDomains.map((split, index) =>
          splitDomains.length > maxRows - 1 && index === splitDomains.length - 1 ? (
            <Domain key={split} domain={split} suffix={false} useTooltip={false} ellipsisLength={maxCols} />
          ) : (
            <span key={split}>{split}</span>
          )
        )}
      </span>
    </ToolTip>
  );
});
