import React, { useState, useCallback, useMemo } from 'react';
import cx from 'clsx';
import { useForm } from 'react-hook-form';
import Button from '@components/Button';
import { showModal, showDrawer, hideAllModal } from '@components/showPopup';
import Input from '@components/Input';
import isMobile from '@utils/isMobie';
import { domainTransfer as _domainTransfer } from '@service/domainTransfer';
import useInTranscation from '@hooks/useInTranscation';

interface Props {
  domain: string;
}

const ModalContent: React.FC<Props> = ({ domain }) => {
  const { register, handleSubmit: withForm, setValue } = useForm();
  const { inTranscation, execTranscation: domainTranster } = useInTranscation(_domainTransfer);

  const handleDomainTransfer = useCallback(
    withForm(({ newOwnerAddress }) => {
      debugger
      domainTranster({ domain, newOwnerAddress });
    })
    , []);

  return (
    <form onSubmit={handleDomainTransfer}>
      <Input
        id="new-domain-owner"
        size={isMobile() ? 'normal' : 'medium'}
        placeholder="输入.Web名称或者Confluxcore地址"
        {...register('newOwnerAddress', { required: true })}
      />
      <p>转让地址</p>
      <Button
        size="mini"
        loading={inTranscation}
      >
        确认
      </Button>
    </form>
  )
}
const showDomainTransferModal = (params: Props) => {
  if (isMobile()) {
    showDrawer({ Content: <ModalContent {...params} />, title: '域名转让' });
  } else {
    showModal({ Content: <ModalContent {...params} />, title: '域名转让' });
  }
};

export default showDomainTransferModal;