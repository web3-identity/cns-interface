import React, { Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import cx from 'clsx';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import payMethod from '@service/payMethod';
import { commitRegistration as _commitRegistration, usePayPrice, useRefreshPayPrice } from '@service/domainRegister';

const PrideFetch: React.FC<{ domain: string; }> = ({ domain }) => {
  const payPrice = usePayPrice(domain);

  if (payMethod === 'web3') {
    return <>{Math.round(+payPrice?.toDecimalStandardUnit())}</>;
  }

  return <>{payPrice?.toDecimalStandardUnit(2, 18)}</>;
};

const Loading: React.FC<{ isPending?: boolean }> = ({ isPending }) => (
  <Delay mode="opacity">
    {!isPending && <span>0.00</span>}
    <div className="absolute top-0 left-0 w-full h-full flex items-center bg-purple-dark-active">
      <Spin className="text-.9em" />
    </div>
  </Delay>
);

const ErrorBoundaryFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => (
  <span className="text-14px text-error-normal cursor-pointer select-none group" onClick={resetErrorBoundary}>
    获取价格失败，<span className="underline group-hover:underline-none">点此重试</span>
  </span>
);

const PayPrice: React.FC<{ domain: string; isPending?: boolean; className?: string }> = ({ domain, isPending, className }) => {
  const refreshPayPrice = useRefreshPayPrice(domain);

  return (
    <div className={cx('relative flex items-baseline', className)}>
      <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} />} onReset={refreshPayPrice}>
        <Suspense fallback={<Loading isPending={isPending} />}>
          <span className="mr-4px text-.35em text-grey-normal-hover text-opacity-50">{payMethod === 'web3' ? 'CFX' : '￥'}</span>
          <span className="text-grey-normal font-bold">
            <PrideFetch domain={domain} />
          </span>
        </Suspense>
        {isPending && <Loading isPending={isPending} />}
      </ErrorBoundary>
    </div>
  );
};

export default PayPrice;
