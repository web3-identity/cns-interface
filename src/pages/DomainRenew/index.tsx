import React from 'react';
import cx from 'clsx';
import { showModal, showDrawer } from '@components/showPopup';
import Domain from '@modules/Domain';
import { domainTransfer as _domainTransfer } from '@service/domainTransfer';
import { useIsOwner, useRefreshDomainExpire } from '@service/domainInfo';
import { web3Renew as _web3Renew, resetRenewStep, useRenewStep, RenewStep, resetRenewOrderId } from '@service/domainRenew';
import { useAccount } from '@service/account';
import payMethod from '@service/payMethod';
import { resetRegisterDurationYears } from '@pages/DomainRegister/Register/Step1';
import isMobile from '@utils/isMobie';
import InputDurationYears from './InputDurationYears';
import Web2Renew from './Web2Renew';
import WaitConfirm from './WaitConfirm';
import Success from './Success';

interface Props {
  domain: string;
}

const ModalContent: React.FC<Props> = ({ domain }) => {
  const account = useAccount();
  const isOwner = useIsOwner(domain);
  const renewStep = useRenewStep(domain);
  const refreshDomainExpire = useRefreshDomainExpire(domain);
  const isNotYourDomain = isOwner === false || !account;

  return (
    <div className={cx("relative mt-16px text-14px text-grey-normal-hover text-opacity-50", isNotYourDomain ? 'h-308px' : 'h-248px lt-md:h-264px')}>
      <Domain domain={domain} className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-34px p-8px bg-purple-dark-active" />
      {renewStep === RenewStep.InputDurationYears && <InputDurationYears domain={domain} refreshDomainExpire={refreshDomainExpire} />}
      {renewStep === RenewStep.WaitRenewPay && payMethod === 'web2' && <Web2Renew domain={domain} />}
      {renewStep === RenewStep.WaitConfirm && <WaitConfirm domain={domain} />}
      {renewStep === RenewStep.Success && <Success />}
      {isNotYourDomain && <div className="absolute left-0 right-0 bottom-0 md:py-16px md:rounded-12px text-center bg-#26233E lt-md:bg-transparent">*此域名注册人非当前地址，为其他人的域名续费并不会获得该域名的所有权。</div>}
    </div>
  );
};

const showDomainRenewModal = (params: Props) => {
  const onClose = () =>
    setTimeout(() => {
      resetRegisterDurationYears(params.domain);
      resetRenewStep(params.domain);
      resetRenewOrderId(params.domain)
    }, 250);

  if (isMobile) {
    showDrawer({ Content: <ModalContent {...params} />, title: '用户名续费', onClose });
  } else {
    showModal({ Content: <ModalContent {...params} />, title: '用户名续费', onClose });
  }
};

export default showDomainRenewModal;
