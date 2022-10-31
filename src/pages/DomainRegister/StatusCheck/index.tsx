import React, { Suspense, type PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import Button from '@components/Button';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import { useAccount } from '@service/account';
import { useDomainStatus, useRefreshDomainStatus, useDomainOwner, DomainStatus } from '@service/domainInfo';
import { RegisterBox } from '@pages/DomainRegister';

interface Props {
  domain: string;
}

const Status = ({ domain, children }: PropsWithChildren<Props>) => {
  const handleRefresh = useRefreshDomainStatus(domain);

  return (
    <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} />} onReset={handleRefresh}>
      <Suspense fallback={<StatusLoading />}>
        <StatusContent domain={domain} children={children} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Status;

const statusMap = {
  [DomainStatus.Valid]: {
    text: '可注册',
  },
  [DomainStatus.Registered]: {
    text: '域名已被注册',
  },
  [DomainStatus.Reserved]: {
    text: '域名未开放',
  },
  [DomainStatus.Locked]: {
    text: '域名已锁定',
  },
  [DomainStatus.TooShort]: {
    text: '域名太短',
  },
  [DomainStatus.IllegalChar]: {
    text: '域名包含不支持的字符',
  },
} as const;

const Warning = () => (
  <span className="flex justify-center items-center w-80px h-80px rounded-full border-7.5px border-purple-normal">
    <span className="i-ant-design:warning-filled text-purple-normal text-47.5px -translate-y-4px" />
  </span>
);

const StatusContent = ({ domain, children }: PropsWithChildren<Props>) => {
  const status = useDomainStatus(domain);
  const owner = useDomainOwner(domain);
  const account = useAccount();

  return (
    <>
      {(status === DomainStatus.Valid || owner === account) ? (
        children
      ) : (
        <RegisterBox className="relative flex flex-col items-center pt-66px">
          <Warning />
          <p className="mt-16px mb-20px text-14px text-grey-normal">{statusMap[status].text}</p>

          {status === DomainStatus.Registered && (
            <Link to={`/setting/${domain}`} className="no-underline">
              <Button>查看</Button>
            </Link>
          )}
          {status !== DomainStatus.Registered && (
            <Link to="/" className="no-underline">
              <Button>重新搜索</Button>
            </Link>
          )}
        </RegisterBox>
      )}
    </>
  );
};

const StatusLoading: React.FC = () => (
  <RegisterBox className="flex flex-col items-center pt-66px">
    <Delay>
      <Spin className="text-80px" />
      <p className="mt-16px text-14px text-grey-normal">查询中...</p>
    </Delay>
  </RegisterBox>
);

const ErrorBoundaryFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => {
  return (
    <RegisterBox className="flex flex-col items-center pt-66px">
      <Warning />
      <p className="mt-16px mb-20px text-14px text-grey-normal">网络错误，请稍后再试</p>
      <Button onClick={resetErrorBoundary}>重试</Button>
    </RegisterBox>
  );
};
