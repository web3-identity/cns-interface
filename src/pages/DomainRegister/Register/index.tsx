import React, { useEffect } from 'react';
import { useRefreshDomainStatus } from '@service/domainInfo';
import { RegisterStep, useRegisterStep, useCommitInfo, useMonitorDomainState } from '@service/domainRegister';
import Step1 from './Step1';
import WaitCommitConfirm from './WaitCommitConfirm';
import Step2 from './Step2';
import Step3 from './Step3';

const Register: React.FC<{ domain: string }> = ({ domain }) => {
  const registerStep = useRegisterStep(domain);
  const commitInfo = useCommitInfo(domain);
  const refreshDomainStatus = useRefreshDomainStatus(domain);
  useEffect(refreshDomainStatus, [registerStep]);
  useMonitorDomainState(domain);

  if (registerStep === RegisterStep.WaitCommit) {
    if (commitInfo) return <WaitCommitConfirm domain={domain} />;
    else return <Step1 domain={domain} />;
  } else if (registerStep === RegisterStep.WaitPay) {
    return <Step2 domain={domain} commitInfo={commitInfo} />;
  } else {
    return <Step3 domain={domain} />;
  }
};

export default Register;
