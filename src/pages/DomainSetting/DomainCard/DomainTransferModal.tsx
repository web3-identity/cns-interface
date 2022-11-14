import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@components/Button';
import { showModal, showDrawer, hideAllModal } from '@components/showPopup';
import Input from '@components/Input';
import isMobile from '@utils/isMobie';
import { domainTransfer as _domainTransfer } from '@service/domainTransfer';
import { chainsEncoder } from '@service/domainRegistrar';
import { useRefreshDomainOwner } from '@service/domainInfo';
import { useAccount } from '@service/account';
import useInTranscation from '@hooks/useInTranscation';

interface Props {
  domain: string;
}

const ModalContent: React.FC<Props> = ({ domain }) => {
  const refreshDomainOwner = useRefreshDomainOwner(domain);
  const selfAddress = useAccount();
  const validateSelf = useCallback((address: string) => address !== selfAddress, [selfAddress]);
  
  const {
    register,
    handleSubmit: withForm,
    formState: {
      errors: { newOwnerAddress: error },
    },
  } = useForm();
  const { inTranscation, execTranscation: domainTranster } = useInTranscation(_domainTransfer);

  const handleDomainTransfer = useCallback(
    withForm(({ newOwnerAddress }) => {
      domainTranster({ domain, newOwnerAddress, refreshDomainOwner });
    }),
    []
  );

  return (
    <form onSubmit={handleDomainTransfer}>
      <p className="mt-24px mb-16px text-grey-normal-hover text-opacity-50">转让地址</p>
      <div className="relative">
        <Input
          id="new-domain-owner"
          wrapperClassName="border-2px border-purple-normal rounded-8px"
          placeholder="输入 .Web3 名称或者 Conflux Core 地址"
          {...register('newOwnerAddress', { required: true, validate: { 'format': chainsEncoder['Conflux Core'].validate, 'self': validateSelf } })}
        />
        {!!error && <span className="absolute left-11px top-[calc(100%+.75em)] text-12px text-error-normal">{error.type === 'format' ? '地址格式错误' : '不能转让给自己'}</span>}
      </div>
      <div className="mt-130px mb-72px flex justify-center items-center gap-16px">
        <Button variant="outlined" className="min-w-152px" onClick={hideAllModal} type="button" disabled={inTranscation}>
          取消
        </Button>
        <Button className="min-w-152px" loading={inTranscation}>
          确认
        </Button>
      </div>
    </form>
  );
};
const showDomainTransferModal = (params: Props) => {
  if (isMobile()) {
    showDrawer({ Content: <ModalContent {...params} />, title: '域名转让' });
  } else {
    showModal({ Content: <ModalContent {...params} />, title: '域名转让' });
  }
};

export default showDomainTransferModal;
