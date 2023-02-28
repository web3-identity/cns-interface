import React, { useEffect } from 'react';
import Spin from '@components/Spin';
import { RegisterBox } from '@pages/DomainRegister';
import payMethod from '@service/payMethod';
import { usePrefetchMakeOrder } from '@service/domainRegister';

const WaitCommitConfirm: React.FC<{ domain: string; type: 'waitCommitConfirm' | 'waitPayConfirm' }> = ({ domain, type }) => {
  const prefetchMakeOrder = usePrefetchMakeOrder();
  useEffect(() => {
    if (type !== 'waitCommitConfirm' || payMethod !== 'web2') return;
    prefetchMakeOrder(domain);
  }, []);

  return (
    <RegisterBox title={type === 'waitCommitConfirm' ? '第一步：申请注册' : '第二步：支付'} className="flex flex-col text-14px leading-18px text-grey-normal">
      <Spin className="mx-auto mt-56px mb-16px text-80px lt-md:mt-96px" />
      <p className="text-center">{type === 'waitCommitConfirm' ? '正在确认你申请的注册内容...' : '区块链确认中...'}</p>
    </RegisterBox>
  );
};

export default WaitCommitConfirm;
