import React, { useEffect, useRef } from 'react';
import { RegisterContainer } from '../index';
import WechatPayQrCode from '@assets/images/WechatPayQrCode.png';
import timerNotifier from '@utils/timerNotifier';
import { useCommitLockTime } from '@service/domain/register';

const Step2: React.FC<{ domain: string; }> = ({ domain }) => {
  const remainTimeDOM = useRef<HTMLDivElement>(null);
  const commitLockTime = useCommitLockTime(domain);
  
  useEffect(() => {
    if (!commitLockTime || !remainTimeDOM) return;
    const timerUnit: Parameters<typeof timerNotifier.addUnit>[0] = {
      key: 'commit-remainTime',
      type: 'second',
      update: (remainTime) => {
        if (!remainTimeDOM.current) return;
        remainTimeDOM.current.innerText = `${remainTime.minutes}分:${remainTime.seconds}秒`;
      },
      endDate: new Date(commitLockTime.end),
    };
    timerNotifier.addUnit(timerUnit);

    return () => {
      timerNotifier.deleteUnit('commit-remainTime');
    };
  }, [commitLockTime]);

  return (
    <RegisterContainer title="第二步：支付" className="flex flex-col text-14px text-grey-normal-hover text-opacity-50">
      <div className='mt-24px flex-1 flex justify-between md:px-8%'>
        <div className='pt-16px flex flex-col gap-24px'>
          <p className='flex items-center'>
            注册域名
            <span className='ml-32px text-28px text-grey-normal font-bold'>{domain}.web3</span>
          </p>

          <p className='flex items-center'>
            注册时长
            <span className='ml-32px text-28px text-grey-normal font-bold'>20</span>
            <span className='ml-4px mt-6px'>年</span>
          </p>

          <p className='flex items-center'>
            总计花费
            <span className='ml-32px text-28px text-grey-normal font-bold'>639.00</span>
            <span className='ml-4px mt-6px'>￥</span>
          </p>
        </div>

        <div className='flex flex-col w-288px rounded-12px bg-violet-normal-hover overflow-hidden'>
          <img src={WechatPayQrCode} alt='wechat-pay' className='my-20px mx-auto w-100px h-100px' />
          <div className='flex-1 flex flex-col justify-center items-center bg-#26233E leading-24px'>
            <p>
              请使用
              <span className='i-ri:wechat-pay-fill mx-4px text-24px text-#09BB07 -translate-y-1px'/>
              微信扫码支付域名注册费
            </p>
            <p className='mt-2px'>
              请在
              <span ref={remainTimeDOM} className='inline-block mx-4px min-w-68px text-center text-grey-normal'>14:59</span>
              内完成支付
            </p>
          </div>
        </div>
      </div>
    </RegisterContainer>
  );
};

export default Step2;
