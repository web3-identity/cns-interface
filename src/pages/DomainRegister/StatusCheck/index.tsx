import React, { memo, useCallback, Suspense, type PropsWithChildren, type ComponentProps } from 'react';
import cx from 'clsx';
import { Link } from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import Button from '@components/Button';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import { useDomainStatus, useRefreshDomainStatus, useIsOwnerSuspense, useRefreshDomainOwner, DomainStatus, useDomainSensitiveCensor, useRefreshDomainSensitiveCensor } from '@service/domainInfo';
import { RegisterBox } from '@pages/DomainRegister';

interface Props {
  domain: string;
}

const StatusCheck = ({ domain, isPending, children }: PropsWithChildren<Props & { isPending: boolean }>) => {
  const refreshDomainStatus = useRefreshDomainStatus(domain);
  const refreshDomainOwner = useRefreshDomainOwner(domain);
  const refreshDomainSensitiveCensor = useRefreshDomainSensitiveCensor(domain);
  const refresh = useCallback(() => {
    refreshDomainStatus();
    refreshDomainOwner();
    refreshDomainSensitiveCensor();
  }, [domain]);

  return (
    <div className="relative">
      <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} />} onReset={refresh}>
        <Suspense fallback={<StatusLoading />}>
          <StatusContent domain={domain} children={children} />
        </Suspense>
      </ErrorBoundary>

      {isPending && (
        <Delay>
          <StatusLoading className="absolute top-0 left-0 w-full h-full" />
        </Delay>
      )}
    </div>
  );
};

export default memo(StatusCheck);

const statusMap = {
  [DomainStatus.Valid]: {
    text: '可注册',
  },
  [DomainStatus.Registered]: {
    text: '用户名已被注册',
  },
  [DomainStatus.Reserved]: {
    text: '用户名未开放',
  },
  [DomainStatus.Locked]: {
    text: '用户名已锁定',
  },
  [DomainStatus.TooShort]: {
    text: '用户名太短',
  },
  [DomainStatus.IllegalChar]: {
    text: '用户名包含不支持的字符',
  },
  [DomainStatus.NotOpen]: {
    text: '用户名未开放',
  },
  [DomainStatus.Illegal]: {
    text: '用户名不能以 - 开头或结尾',
  },
} as const;

const Warning = () => (
  <span className="flex justify-center items-center w-80px h-80px rounded-full border-7.5px border-purple-normal">
    <span className="i-ant-design:warning-filled text-purple-normal text-47.5px -translate-y-4px" />
  </span>
);

const StatusContent = ({ domain, children }: PropsWithChildren<Props>) => {
  const status = useDomainStatus(domain);
  const isOwner = useIsOwnerSuspense(domain);
  const illegalSensitiveCensor = useDomainSensitiveCensor(domain);

  return (
    <>
      {illegalSensitiveCensor === false && (status === DomainStatus.Valid || isOwner) ? (
        children
      ) : (
        <RegisterBox className="relative flex flex-col justify-center items-center">
          <Warning />
          <p className="mt-16px mb-20px text-14px text-grey-normal">{illegalSensitiveCensor || statusMap[status].text}</p>

          {!illegalSensitiveCensor && status === DomainStatus.Registered && (
            <Link to={`/setting/${domain}`} className="no-underline">
              <Button className="w-152px lt-md:w-132px">查看</Button>
            </Link>
          )}
          {(illegalSensitiveCensor || status !== DomainStatus.Registered) && (
            <Link to="/" className="no-underline">
              <Button className="w-152px lt-md:w-132px">重新搜索</Button>
            </Link>
          )}
        </RegisterBox>
      )}
    </>
  );
};

const StatusLoading: React.FC<ComponentProps<'div'>> = ({ className, ...props }) => (
  <RegisterBox className={cx('flex flex-col justify-center items-center', className)} {...props}>
    <Delay>
      <Spin className="text-80px" />
      <p className="mt-16px text-14px text-grey-normal">查询中...</p>
    </Delay>
  </RegisterBox>
);

const ErrorBoundaryFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => {
  return (
    <RegisterBox className="flex flex-col justify-center items-center">
      <Warning />
      <p className="mt-16px mb-20px text-14px text-grey-normal">网络错误，请稍后再试</p>
      <Button onClick={resetErrorBoundary} className="w-152px lt-md:w-132px">
        重试
      </Button>
    </RegisterBox>
  );
};
