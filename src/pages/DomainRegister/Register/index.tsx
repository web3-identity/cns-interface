import React from 'react';
import { RegisterStep, useRegisterStep, useCommitInfo, useMonitorDomainState, useWaitPayConfrimState } from '@service/domainRegister';
import Step1 from './Step1';
import WaitConfirm from './WaitConfirm';
import Step2 from './Step2';
import Step3 from './Step3';

const Register: React.FC<{ domain: string }> = ({ domain }) => {
  const registerStep = useRegisterStep(domain);
  const commitInfo = useCommitInfo(domain);
  const isWaitPayConfrim = useWaitPayConfrimState(domain);
  useMonitorDomainState(domain);

  if (registerStep === RegisterStep.WaitCommit) {
    if (commitInfo) return <WaitConfirm type="waitCommitConfirm" />;
    else return <Step1 domain={domain} />;
  } else if (registerStep === RegisterStep.WaitPay) {
    if (isWaitPayConfrim) return <WaitConfirm type="waitPayConfirm" />;
    else return <Step2 domain={domain} commitInfo={commitInfo} />;
  } else {
    return <Step3 domain={domain} />;
  }
};

export default Register;
