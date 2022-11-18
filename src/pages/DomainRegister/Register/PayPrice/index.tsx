import React, { Suspense } from 'react';
import cx from 'clsx';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import { usePayMethod } from '@service/payMethod';
import { commitRegistration as _commitRegistration, usePayPrice } from '@service/domainRegister';

const PrideFetch: React.FC<{ domain: string; payMethod: ReturnType<typeof usePayMethod> }> = ({ domain, payMethod }) => {
  const payPrice = usePayPrice(domain);

  if (payMethod === 'web3') {
    return <>{Math.round(+payPrice?.toDecimalStandardUnit())}</>;
  }

  return <>{payPrice?.toDecimalStandardUnit(2, 8)}</>
};

const Loading: React.FC<{ isPending?: boolean; }> = ({ isPending }) => (
  <Delay mode="opacity">
    {!isPending && <span>0.00</span>}
    <div className="absolute top-0 left-0 w-full h-full flex items-center bg-purple-dark-active">
      <Spin className="text-.9em" />
    </div>
  </Delay>
);

const PayPrice: React.FC<{ domain: string; isPending?: boolean; className?: string }> = ({ domain, isPending, className }) => {
  const payMethod = usePayMethod();

  return (
    <div className={cx('relative flex items-baseline', className)}>
      <Suspense fallback={<Loading isPending={isPending} />}>
        <span className="mr-4px text-.35em text-grey-normal-hover text-opacity-50">{payMethod === 'web3' ? 'CFX' : '￥'}</span>
        <span className="text-grey-normal font-bold">
          <PrideFetch domain={domain} payMethod={payMethod} />
        </span>
      </Suspense>
      {isPending && <Loading isPending={isPending} />}
    </div>
  );
};

export default PayPrice;
