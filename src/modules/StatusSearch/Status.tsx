import React, { Suspense, type ComponentProps } from 'react';
import { Link, useLocation } from 'react-router-dom';
import cx from 'clsx';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import Button from '@components/Button';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import Domain from '@modules/Domain';
import { useDomainStatus, useRefreshDomainStatus, useIsOwnerSuspense, DomainStatus } from '@service/domainInfo';
import { usePrefetchSettingPage } from '@service/prefetch';
import { useParamsDomain } from '@hooks/useParamsDomain';
import { ReactComponent as StatusLocked } from '@assets/icons/status-locked.svg';
import { ReactComponent as StatusRegistered } from '@assets/icons/status-registered.svg';
import { ReactComponent as StatusReserved } from '@assets/icons/status-reserved.svg';
import { ReactComponent as StatusValid } from '@assets/icons/status-valid.svg';
import { ReactComponent as StatusInvalid } from '@assets/icons/status-invalid.svg';
import { btnClassMap } from './index';

interface Props {
  domain: string;
  where: 'home' | 'header';
  isSmall: boolean;
}

const Status: React.FC<Props & ComponentProps<'div'>> = ({ domain, isSmall, where, className, ...props }) => {
  const refreshDomainStatus = useRefreshDomainStatus(domain);
  const { pathname } = useLocation();
  const paramsDomain = useParamsDomain();

  const isInRegister = pathname?.startsWith('/register/');
  const isInSetting = pathname?.startsWith('/setting/');

  return (
    <div
      className={cx('flex items-center bg-purple-dark-active whitespace-nowrap', className, {
        'h-92px lt-md:h-56px rounded-24px lt-md:rounded-12px': where === 'home',
        'h-48px rounded-10px': where === 'header',
        'pl-24px pr-12px text-22px': !isSmall,
        'pl-12px pr-8px text-16px': isSmall,
      })}
      {...props}
    >
      {(isInRegister || isInSetting) && paramsDomain === domain ? (
        <SearchDomainEqualCurrentRegister isSmall={isSmall} type={isInRegister ? 'inRegister' : 'inSetting'} />
      ) : (
        <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} isSmall={isSmall} where={where} />} onReset={refreshDomainStatus}>
          <Suspense fallback={<StatusLoading />}>
            <StatusContent domain={domain} isSmall={isSmall} where={where} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default Status;

const statusMap = {
  [DomainStatus.Valid]: {
    icon: StatusValid,
    text: '可注册',
    color: 'text-green-normal',
  },
  [DomainStatus.Registered]: {
    icon: StatusRegistered,
    text: '已注册',
    color: 'text-#FF9900',
  },
  [DomainStatus.Reserved]: {
    icon: StatusReserved,
    text: '未开放',
    color: 'text-#83828F',
  },
  [DomainStatus.Locked]: {
    icon: StatusLocked,
    text: '已锁定',
    color: 'text-purple-normal',
  },
  [DomainStatus.TooShort]: {
    icon: StatusInvalid,
    text: '域名太短',
    color: 'text-error-normal',
  },
  [DomainStatus.IllegalChar]: {
    icon: StatusInvalid,
    text: '域名包含不支持的字符',
    color: 'text-error-normal',
  },
  [DomainStatus.NotOpen]: {
    icon: StatusReserved,
    text: '未开放',
    color: 'text-#83828F',
  },
} as const;

const StatusContent: React.FC<Props> = ({ domain, where, isSmall }) => {
  const status = useDomainStatus(domain);
  const isOwner = useIsOwnerSuspense(domain);
  const Icon = !isOwner ? statusMap[status].icon : statusMap[DomainStatus.Valid].icon;
  const ellipsisLength = where === 'header' ? 14 : isSmall ? 11 : 24;

  const prefetchSettingPage = usePrefetchSettingPage(domain);

  return (
    <>
      <Icon className={cx('-translate-y-2px flex-shrink-0', isSmall ? 'mr-4px w-28px h-28px' : 'mr-12px w-40px h-40px')} />
      <span className={cx('mr-auto', !isOwner ? statusMap[status].color : statusMap[DomainStatus.Valid].color)}>
        {!isOwner ? statusMap[status].text : '您已注册'}
        <Domain
          className={cx('font-bold', isSmall ? 'ml-4px' : 'ml-8px ')}
          domain={domain}
          ellipsisLength={status === DomainStatus.IllegalChar ? ellipsisLength - 4 : ellipsisLength}
        />
      </span>

      {status === DomainStatus.Valid && (
        <Link to={`/register/${domain}`} className="no-underline">
          <Button className={btnClassMap[where]}>注册</Button>
        </Link>
      )}
      {status === DomainStatus.Registered && (
        <Link to={`/setting/${domain}`} className="no-underline" onMouseEnter={prefetchSettingPage}>
          <Button className={btnClassMap[where]}>查看</Button>
        </Link>
      )}
    </>
  );
};

const StatusLoading: React.FC = () => (
  <Delay>
    <Spin className="text-1.4em" />
  </Delay>
);

const ErrorBoundaryFallback: React.FC<FallbackProps & Omit<Props, 'domain'>> = ({ resetErrorBoundary, where, isSmall }) => {
  return (
    <>
      <StatusInvalid className={cx('-translate-y-2px flex-shrink-0', isSmall ? 'mr-4px w-28px h-28px' : 'mr-12px w-40px h-40px')} />
      <span className="mr-auto text-error-normal">网络错误</span>
      <Button onClick={resetErrorBoundary} className={btnClassMap[where]}>
        重试
      </Button>
    </>
  );
};

const SearchDomainEqualCurrentRegister: React.FC<Pick<Props, 'isSmall'> & { type: 'inRegister' | 'inSetting' }> = ({ type, isSmall }) => {
  return (
    <>
      <StatusValid className={cx('-translate-y-2px flex-shrink-0', isSmall ? 'mr-4px w-28px h-28px' : 'mr-12px w-40px h-40px')} />
      <span className="mr-auto text-green-normal">
        {type === 'inRegister' ? '搜索域名为当前注册中域名' : '搜索域名即为当前设置页域名'}
      </span>
    </>
  );
};
