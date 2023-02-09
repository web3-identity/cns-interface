import React from 'react';
import Spin from '@components/Spin';
import { useRenewOrderId, useMonitorWeb2PcRenewPayStatus } from '@service/domainRenew';

const WaitConfirm: React.FC<{ domain: string; }> = ({ domain }) => {
  const renewOrderId = useRenewOrderId(domain);
  useMonitorWeb2PcRenewPayStatus({ domain, id: renewOrderId });
  
  return (
    <div className='pt-48px'>
      <Spin className="mb-16px w-80px h-80px !block mx-auto" />
      <p className="text-center text-14px leading-20px text-#F0EEE9">区块链确认中...</p>
    </div>
  );
};

export default WaitConfirm;
