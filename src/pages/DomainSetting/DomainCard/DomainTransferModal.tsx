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
  const { register, handleSubmit: withForm, formState: { errors: { newOwnerAddress: error } } } = useForm();
  const { inTranscation, execTranscation: domainTranster } = useInTranscation(_domainTransfer);

  const handleDomainTransfer = useCallback(
    withForm(({ newOwnerAddress }) => {
      domainTranster({ domain, newOwnerAddress });
    })
    , []);

  return (
    <form onSubmit={handleDomainTransfer}>
      <p className='mt-6 mb-4 text-grey-normal-hover text-opacity-50'>转让地址</p>
      <div className='relative'>
        <Input
          id="new-domain-owner"
          className="border-2px border-purple-normal rounded-8px bg-purple-dark-active overflow-hidden dropdown-shadow p-4 text-14px"
          size="small"
          placeholder="输入.Web名称或者Confluxcore地址"
          {...register('newOwnerAddress', { required: true })}
        />
        {error?.type === 'required' && <span className="absolute left-7px top-[calc(100%+.75em)] text-12px text-error-normal">新地址不能为空</span>}
      </div>
      <div className='flex justify-center mt-[131px]'>
        <Button
          className='mb-12'
          size="normal"
          loading={inTranscation}
        >
          确认
        </Button>
      </div>
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