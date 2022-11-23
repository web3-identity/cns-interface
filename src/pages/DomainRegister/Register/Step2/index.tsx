import React, { useEffect, useRef } from 'react';
import Button from '@components/Button';
import Domain from '@modules/Domain';
import isMobile from '@utils/isMobie';
import timerNotifier from '@utils/timerNotifier';
import { web3Pay as _web3Pay, type CommitInfo } from '@service/domainRegister';
import { usePayMethod } from '@service/payMethod';
import { ReactComponent as FluentIcon } from '@assets/icons/fluent.svg';
import { RegisterBox } from '@pages/DomainRegister';
import useInTranscation from '@hooks/useInTranscation';
import QRCode from './QRCode_web2pc';
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
        remainTimeDOM.current.innerText = `${remainTime.minutes}:${remainTime.seconds}`;
      },
      endDate: new Date(validTime.end),
    };
    timerNotifier.addUnit(timerUnit);

    return () => {
      timerNotifier.deleteUnit('commit-remainTime');
    };
  }, [validTime?.end]);

  const { inTranscation, execTranscation: web3Pay } = useInTranscation(_web3Pay);

  if (!commitInfo) return null;
  return (
    <RegisterBox title="第二步：支付" className="flex flex-col text-14px text-grey-normal-hover text-opacity-50 lt-md:text-12px">
      <div className="mt-24px flex-1 flex justify-between md:px-4% lt-md:flex-col">
        <div className="md:pt-8px flex flex-col gap-20px">
          <div className="flex items-baseline h-32px lt-md:h-20px lt-md:items-center">
            注册域名
            <Domain className="ml-24px text-28px text-grey-normal font-bold lt-md:text-16px lt-md:ml-8px md:translate-y-1px" domain={domain} />
          </div>

          <div className="flex items-baseline h-32px lt-md:h-20px lt-md:items-center">
            注册时长
            <span className="ml-24px text-28px text-grey-normal font-bold lt-md:text-16px lt-md:ml-8px md:translate-y-1px">
              {durationYears < 10 ? `0${durationYears}` : durationYears}
            </span>
            <span className="ml-4px mt-6px">{import.meta.env.VITE_RegisterUnit || '年'}</span>
          </div>

          <div className="flex items-baseline h-32px lt-md:h-20px lt-md:items-center">
            <span>总计花费</span>
            <PayPrice className="ml-24px text-28px lt-md:text-16px lt-md:ml-8px md:translate-y-1px" domain={domain} />
          </div>
        </div>

        <div className="flex flex-col w-288px rounded-12px bg-violet-normal-hover overflow-hidden lt-md:bg-transparent lt-md:w-full">
          {payMethod === 'web3' && (
            <Button loading={inTranscation} className="mx-auto my-20px w-100px h-100px rounded-full text-40px" onClick={() => web3Pay({ domain, durationYears })}>
              买
            </Button>
          )}
          {payMethod === 'web2' && <QRCode domain={domain} />}
          <div className="flex-1 flex flex-col justify-center items-center bg-#26233E leading-24px lt-md:bg-transparent">
            <p>
              请使用
              {payMethod === 'web3' ? (
                <>
                  <FluentIcon className="ml-4px mr-2px w-24px h-24px translate-y-6px" />
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
            <p className="mt-2px flex items-center">
              请在
              <span ref={remainTimeDOM} className="contain-content inline-block mx-4px text-center text-grey-normal lt-md:text-14px lt-md:leading-24px">
                09:30
              </span>
              内完成支付
            </p>
            {/* {isMobile() && (
              <Button fullWidth>
                <>
                  <span className="i-ri:wechat-pay-fill mx-4px text-24px text-#09BB07 -translate-y-1px" />
                  微信支付
                </>
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </RegisterBox>
  );
};

export default Step2;
