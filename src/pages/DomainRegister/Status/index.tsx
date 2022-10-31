import React, { Suspense, type HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import cx from 'clsx';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import Button from '@components/Button';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import { useDomainStatus, useRefreshDomainStatus, DomainStatus } from '@service/domainInfo';
import { ReactComponent as StatusLocked } from '@assets/icons/status-locked.svg';
import { ReactComponent as StatusRegistered } from '@assets/icons/status-registered.svg';
import { ReactComponent as StatusReserved } from '@assets/icons/status-reserved.svg';
import { ReactComponent as StatusValid } from '@assets/icons/status-valid.svg';
import { ReactComponent as StatusInvalid } from '@assets/icons/status-invalid.svg';
import { RegisterBox } from '@pages/DomainRegister';

interface Props {
  domain: string;
}

const Status: React.FC<Props & HTMLAttributes<HTMLDivElement>> = ({ domain, className, ...props }) => {
  const handleRefresh = useRefreshDomainStatus(domain);

  return (
    <div className={cx('flex items-center pl-24px bg-purple-dark-active', className)} {...props}>
      <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} />} onReset={handleRefresh}>
        <Suspense fallback={<StatusLoading />}>
          <StatusContent domain={domain} />
        </Suspense>
      </ErrorBoundary>
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
} as const;

const StatusContent: React.FC<{ domain: string } & Props> = ({ domain, where }) => {
  const status = useDomainStatus(domain);

  const Icon = statusMap[status].icon;
  return (
    <>
      <Icon className="mr-12px w-40px h-40px -translate-y-2px" />
      <span className={cx('mr-auto', statusMap[status].color)}>
        {statusMap[status].text}
        <span className="ml-24px font-bold">{domain}.web3</span>
      </span>

      {status === DomainStatus.Valid && (
        <Link to={`/register/${domain}`} className="no-underline">
          <Button size={where === 'header' ? 'small' : 'medium'} color="gradient">
            注册
          </Button>
        </Link>
      )}
      {status === DomainStatus.Registered && (
        <Link to={`/register/${domain}`} className="no-underline">
          <Button size={where === 'header' ? 'small' : 'medium'}>查看</Button>
        </Link>
      )}
    </>
  );
};

const StatusLoading: React.FC = () => (
  <Delay>
    <Spin className="text-1.4em text-green-normal" />
  </Delay>
);

const ErrorBoundaryFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => {
  return (
    <>
      <StatusInvalid className="mr-12px w-40px h-40px -translate-y-2px" />
      <span className="mr-auto text-error-normal">网络错误</span>
      <Button onClick={resetErrorBoundary}>
        重试
      </Button>
    </>
  );
};
