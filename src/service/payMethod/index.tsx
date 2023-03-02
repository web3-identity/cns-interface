import React from 'react';
import isMobile from '@utils/isMobie';
import { showModal, showDrawer } from '@components/showPopup';

const payMethod = import.meta.env.MODE.startsWith('web2') ? 'web2' : 'web3';

export default payMethod;

export const isPayMethodDisabled = true;

const ModalContent: React.FC = () => {
  return (
    <div className='mt-20px px-8px text-14px text-grey-normal-hover'>
      支付渠道正在维护中，我们将尽快恢复，请您耐心等待。除注册外，不影响其他功能的使用。注册.web3用户名请勿选择生态项目外的平台，注意资产安全。
    </div>
  );
};

export const checkPayMethodValid = (authSucessFunction: Function) => {
  if (!isPayMethodDisabled) {
    authSucessFunction?.();
  } else {
    if (!isMobile) {
      showModal({ Content: <ModalContent />, title: '通知' });
    } else {
      showDrawer({ Content: <ModalContent />, title: '通知' });
    }
  }
};
