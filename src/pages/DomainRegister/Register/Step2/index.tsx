import React, { useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import Button from '@components/Button';
import timerNotifier from '@utils/timerNotifier';
import { web3Pay, type CommitInfo } from '@service/domainRegister';
import { usePayMethod } from '@service/payMethod';
import { ReactComponent as FluentIcon } from '@assets/icons/fluent.svg';
import { RegisterBox } from '@pages/DomainRegister';
import PayPrice from '../PayPrice';

const Step2: React.FC<{ domain: string; commitInfo: CommitInfo | null }> = ({ domain, commitInfo }) => {
  const payMethod = usePayMethod();
  const remainTimeDOM = useRef<HTMLDivElement>(null);
  const { durationYears, validTime } = commitInfo! || {};

  useEffect(() => {
    if (!validTime?.end || !remainTimeDOM) return;
    const timerUnit: Parameters<typeof timerNotifier.addUnit>[0] = {
      key: 'commit-remainTime',
      type: 'second',
      update: (remainTime) => {
        if (!remainTimeDOM.current) return;
        remainTimeDOM.current.innerText = `${remainTime.minutes}分:${remainTime.seconds}秒`;
      },
      endDate: new Date(validTime.end),
    };
    timerNotifier.addUnit(timerUnit);

    return () => {
      timerNotifier.deleteUnit('commit-remainTime');
    };
  }, [validTime?.end]);

  if (!commitInfo) return null;
  return (
    <RegisterBox title="第二步：支付" className="flex flex-col text-14px text-grey-normal-hover text-opacity-50">
      <div className="mt-24px flex-1 flex justify-between md:px-8%">
        <div className="pt-16px flex flex-col gap-24px">
          <div className="flex items-baseline">
            注册域名
            <span className="ml-32px text-28px text-grey-normal font-bold">{domain}.web3</span>
          </div>

          <div className="flex items-baseline">
            注册时长
            <span className="ml-32px text-28px text-grey-normal font-bold">{durationYears < 10 ? `0${durationYears}` : durationYears}</span>
            <span className="ml-4px mt-6px">年</span>
          </div>

          <div className="flex items-baseline">
            总计花费
            <PayPrice className="ml-32px text-28px" domain={domain} />
          </div>
        </div>

        <div className="flex flex-col w-288px rounded-12px bg-violet-normal-hover overflow-hidden">
          {payMethod === 'web3' && <Button className="mx-auto my-20px w-100px h-100px rounded-full text-40px" onClick={() => web3Pay({ domain, durationYears })}>买</Button>}
          {/* <div style={{ height: 'auto', margin: '20px auto', maxWidth: 128, width: '100%' }}>
            <QRCode size={256} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} value={content?.code_url || ''} viewBox={`0 0 256 256`} />
          </div> */}
          <div className="flex-1 flex flex-col justify-center items-center bg-#26233E leading-24px">
            <p>
              请使用
              {payMethod === 'web3' ? (
                <>
                  <FluentIcon className='ml-4px mr-2px w-24px h-24px translate-y-6px'/>
                  Fluent钱包{' '}
                </>
              ) : (
                <>
                  <span className="i-ri:wechat-pay-fill mx-4px text-24px text-#09BB07 -translate-y-1px" />
                  微信扫码
                </>
              )}
              支付域名注册费
            </p>
            <p className="mt-2px">
              请在
              <span ref={remainTimeDOM} className="inline-block mx-4px min-w-68px text-center text-grey-normal">
                09:30秒
              </span>
              内完成支付
            </p>
          </div>
        </div>
      </div>
    </RegisterBox>
  );
};

export default Step2;
