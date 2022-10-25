import React, { type HTMLAttributes } from 'react';
import cx from 'clsx';
import { useRegisterStep, RegisterStep, useIsWaitCommitConfirm } from '@service/domain/register';
import Step1 from './Step1';
import WaitCommitConfirm from './WaitCommitConfirm';
import Step2 from './Step2';
import Step3 from './Step3';

export const RegisterContainer: React.FC<HTMLAttributes<HTMLDivElement> & { title: string }> = ({ title, children, className, ...props }) => {
  return (
    <div className={cx('h-341px p-24px rounded-24px bg-purple-dark-active dropdown-shadow whitespace-nowrap', className)} {...props}>
      <p className="text-22px leading-26px text-grey-normal">{title}</p>
      <div className="mt-22px h-1px bg-purple-normal bg-opacity-30" />
      {children}
    </div>
  );
};

const Register: React.FC<{ domain: string }> = ({ domain }) => {
  const registerStep = useRegisterStep(domain);
  const isWaitCommitConfirm = useIsWaitCommitConfirm(domain);

  if (registerStep === RegisterStep.WaitCommit) {
    if (isWaitCommitConfirm) return <WaitCommitConfirm domain={domain} />
    else return <Step1 domain={domain} />;
  } else if (registerStep === RegisterStep.WaitPay) {
    return <Step2 domain={domain} />;
  } else {
    return <Step3 domain={domain} />;
  }
};

export default Register;
