import React from 'react';
import cx from 'clsx';
import { useRegisterStep, RegisterStep } from '@service/domain/register';
import { ReactComponent as Rocket } from '@assets/images/Rocket.svg';
import './index.css';

const ProgressBar: React.FC<{ domain: string }> = ({ domain }) => {
  const registerStep = useRegisterStep(domain);

  return (
    <div className="mt-32px relative flex justify-between items-center px-32px text-18px text-grey-normal">
      <div className="w-32px h-32px leading-24px border-4px rounded-full text-center border-grey-normal bg-#1B192C">1</div>
      <div className="w-32px h-32px leading-24px border-4px rounded-full text-center border-grey-normal bg-#1B192C">2</div>
      <div className="w-32px h-32px leading-24px border-4px rounded-full text-center border-grey-normal bg-#1B192C">3</div>

      <Rocket className={
        cx("absolute left-1/2 top-1/2 -translate-y-[calc(50%-4px)] w-86px h-57px transition-all duration-400ms", {
          'left-0': registerStep === RegisterStep.WaitCommit,
          'left-[calc(50%-52px)]': registerStep === RegisterStep.WaitPay,
          'left-[calc(100%-100px)]': registerStep === RegisterStep.Success,
        })
      } />
      <div className="resigter-progressBar absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[calc(100%-64px)] h-8px bg-#D9D9D9 -z-1 pointer-events-none" />
    </div>
  );
};

export default ProgressBar;
