import React from 'react';
import cx from 'clsx';
import { RegisterStep } from '@service/domainRegister';
import { ReactComponent as Rocket } from '@assets/images/Rocket.svg';
import './index.css';

const ProgressBar: React.FC<{ registerStep: RegisterStep; }> = ({ registerStep }) => {
  return (
    <div className="mt-24px relative flex justify-between items-center px-32px text-18px text-grey-normal">
      <div
        className={cx(
          'relative w-32px h-32px leading-24px border-4px rounded-full text-center bg-#1B192C transition-colors duration-400ms',
          registerStep > RegisterStep.WaitCommit ? 'text-#7F7D88 border-#25233e bg-#25233e' : 'text-grey-normal border-grey-normal'
        )}
      >
        1
        <p className="absolute left-1/2 -translate-x-1/2 translate-y-80% text-14px lt-md:text-12px whitespace-nowrap">
          <span className="lt-md:display-none">第一步：</span>申请注册
        </p>
      </div>

      <div
        className={cx(
          'relative w-32px h-32px leading-24px border-4px rounded-full text-center bg-#1B192C transition-colors duration-400ms',
          registerStep > RegisterStep.WaitPay ? 'text-#7F7D88 border-#25233e bg-#25233e' : 'text-grey-normal border-grey-normal'
        )}
      >
        2
        <p className="absolute left-1/2 -translate-x-1/2 translate-y-80% text-14px lt-md:text-12px whitespace-nowrap">
          <span className="lt-md:display-none">第二步：</span>支付
        </p>
      </div>

      <div className="relative w-32px h-32px leading-24px border-4px rounded-full text-center border-grey-normal bg-#1B192C">
        3
        <p className="absolute left-1/2 -translate-x-1/2 translate-y-80% text-14px lt-md:text-12px whitespace-nowrap">
          完成
        </p>
      </div>

      <Rocket
        className={cx('absolute top-1/2 -translate-y-[calc(50%-4px)] w-86px h-57px transition-all duration-400ms', {
          'left-0': registerStep === RegisterStep.WaitCommit,
          'left-[calc(50%-52px)]': registerStep === RegisterStep.WaitPay,
          'left-[calc(100%-100px)]': registerStep === RegisterStep.Success,
        })}
      />
      <div className="resigter-progressBar absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[calc(100%-64px)] h-8px bg-#D9D9D9 -z-1 pointer-events-none overflow-hidden">
        <div
          className={cx('w-full h-full left-0 top-0 bg-#25233e transition-transform duration-400ms', {
            '-translate-x-100%': registerStep === RegisterStep.WaitCommit,
            '-translate-x-50%': registerStep === RegisterStep.WaitPay,
            '!-translate-x-0': registerStep === RegisterStep.Success,
          })}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
