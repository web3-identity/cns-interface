import React, { useEffect, useRef } from 'react';
import timerNotifier from '@utils/timerNotifier';
import { ReactComponent as SuccessIcon } from '@assets/icons/Success.svg';
import { clamp } from 'lodash-es';

const Success: React.FC = () => {
  useEffect(() => {}, []);
  const remainTimeDOM = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!remainTimeDOM.current) return;
    const timerUnit: Parameters<typeof timerNotifier.addUnit>[0] = {
      key: 'renew-success-remainTime',
      type: 'second',
      update: (remainTime) => {
        if (!remainTimeDOM.current) return;
        remainTimeDOM.current.innerText = `${clamp(+remainTime.seconds + 1, 0, 10)}s`;
      },
      timing: 10000,
      onEnd: () => {
        history.back();
      },
    };
    timerNotifier.addUnit(timerUnit);

    return () => {
      timerNotifier.deleteUnit('renew-success-remainTime');
    };
  }, []);

  return (
    <div className='pt-48px'>
      <SuccessIcon className="mb-16px w-80px h-80px block mx-auto" />
      <p className="text-center text-14px leading-20px text-#F0EEE9">支付完成</p>
      <p className="text-center text-14px leading-20px text-#F0EEE9">
        <span className="mr-2px" ref={remainTimeDOM}>
          9s
        </span>
        后自动
        <span className="font-medium text-#6667AB underline cursor-pointer" onClick={() => history.back()}>
          返回
        </span>
      </p>
    </div>
  );
};

export default Success;
