import React, { Suspense } from 'react';
import cx from 'clsx';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import { usePayMethod } from '@service/payMethod';
import { commitRegistration as _commitRegistration, usePayPrice } from '@service/domainRegister';

const PrideFetch: React.FC<{ domain: string }> = ({ domain }) => {
  const payPrice = usePayPrice(domain);

  return <>{Math.round(+payPrice?.toDecimalStandardUnit())}</>;
};

const Loading: React.FC = () => (
  <Delay mode="opacity">
    <div className="absolute top-0 left-0 w-full h-full flex items-center bg-purple-dark-active">
      <Spin className="text-.9em" />
    </div>
  </Delay>
);

const PayPrice: React.FC<{ domain: string; isPending?: boolean; className?: string }> = ({ domain, isPending, className }) => {
  const payMethod = usePayMethod();

  return (
    <div className={cx('relative flex items-baseline', className)}>
      <Suspense fallback={<Loading />}>
        <span className="mr-3px text-.35em text-grey-normal-hover text-opacity-50">{payMethod === 'web3' ? 'CFX' : '￥'}</span>
        <span className="text-grey-normal font-bold">
          <PrideFetch domain={domain} />
        </span>
      </Suspense>
      {isPending && <Loading />}
    </div>
  );
};

export default PayPrice;
