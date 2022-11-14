import React, { useCallback, useMemo, useEffect } from 'react';
import Button from '@components/Button';
import { showModal, showDrawer, hideAllModal } from '@components/showPopup';
import Input from '@components/Input';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import isMobile from '@utils/isMobie';
import { domainTransfer as _domainTransfer } from '@service/domainTransfer';
import { chainsEncoder, useDomainRegistrar, getDomainRegistrar } from '@service/domainRegistrar';
import { useRefreshDomainOwner } from '@service/domainInfo';
import { useAccount } from '@service/account';
import useInTranscation from '@hooks/useInTranscation';
import { debounce } from 'lodash-es';

interface Props {
  domain: string;
}

const pattern = /^[0-9A-Za-z]+(\.web3)?$/;
const validateFormat = (address: string) => {
  if (address.startsWith('cfx:') || address.startsWith('cfxtest:')) {
    if (chainsEncoder['Conflux Core'].validate(address)) {
      return 'Conflux Address';
    }
    return false;
  }
  if (pattern.test(address)) {
    return 'Domain';
  }
  return false;
};

const ModalContent: React.FC<Props> = ({ domain }) => {
  const refreshDomainOwner = useRefreshDomainOwner(domain);
  const selfAddress = useAccount();
  const validateSelf = useCallback((address: string) => address !== selfAddress, [selfAddress]);

  const { inTranscation, execTranscation: domainTranster } = useInTranscation(_domainTransfer);

  const [validateStatus, setValidateStatus] = React.useState<'error-registrar-format' | 'error-registrar' | 'error-format' | 'error-self' | 'error-required' | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [inputDomain, setInputDomain] = React.useState('');
  const [transferAddress, setTransferAddress] = React.useState('');

  const debounceValidate = useCallback(
    debounce((value: string) => {
      if (!value) {
        setValidateStatus(null);
        setInputDomain('');
        setTransferAddress('');
        return;
      }

      const validateResult = validateFormat(value);
      if (!validateResult) {
        setValidateStatus('error-format');
        setInputDomain('');
        setTransferAddress('');
      } else {
        if (validateResult === 'Domain') {
          setInputDomain(value);
          setValidateStatus(null);
        } else {
          if (validateSelf(value)) {
            setInputDomain('');
            setValidateStatus(null);
            setTransferAddress(value);
          } else {
            setValidateStatus('error-self');
          }
        }
      }
    }, 250),
    [validateSelf]
  );

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((evt) => {
    const value = evt.target.value;
    setInputValue(value);
    setInputDomain('');
    setValidateStatus(null);
    setTransferAddress('');

    if (!value) {
      setValidateStatus(null);
    }
    debounceValidate(value);
  }, []);

  const handleClickTransfer = useCallback(() => {
    if (!inputValue) {
      setValidateStatus('error-required');
      return;
    }
    if (!domain || !transferAddress) return;
    domainTranster({ domain, transferAddress, refreshDomainOwner });
  }, [domain, inputValue, transferAddress]);

  return (
    <>
      <p className="mt-24px mb-16px text-grey-normal-hover text-opacity-50">转让地址</p>
      <div className="relative">
        <Input
          id="new-domain-owner"
          wrapperClassName="border-2px border-purple-normal rounded-8px"
          placeholder="输入 .Web3 名称 或者 Conflux Core 地址"
          value={inputValue}
          onChange={handleChange}
          onBlur={(evt) => !evt.target.value && setValidateStatus(null)}
        />
        {validateStatus && (
          <div className="absolute left-11px top-[calc(100%+.5em)] flex items-center h-20px text-12px text-error-normal">
            {validateStatus === 'error-format' && '地址格式错误'}
            {validateStatus === 'error-required' && '请输入转让地址'}
            {validateStatus === 'error-registrar' && '该域名未设置解析地址'}
            {validateStatus === 'error-registrar-format' && '该域名解析地址格式错误'}
            {validateStatus === 'error-self' && '不能转给自己'}
          </div>
        )}
        {inputDomain && <DomainAddress domain={inputDomain} setValidateStatus={setValidateStatus} setTransferAddress={setTransferAddress} />}
      </div>
      <div className="mt-130px mb-72px flex justify-center items-center gap-16px">
        <Button variant="outlined" className="min-w-152px" onClick={hideAllModal} type="button" disabled={inTranscation}>
          取消
        </Button>
        <Button className="min-w-152px" loading={inTranscation} onClick={handleClickTransfer}>
          确认
        </Button>
      </div>
    </>
  );
};

const DomainAddress: React.FC<Props & { setValidateStatus: Function; setTransferAddress: Function }> = ({ domain, setValidateStatus, setTransferAddress }) => {
  const { status, domainRegistrars } = useDomainRegistrar(domain?.endsWith('.web3') ? domain.slice(0, domain.length - 5) : domain);
  const cfxRegistrar = useMemo(() => domainRegistrars?.find((registrar) => registrar.chain === 'Conflux Core'), [domainRegistrars]);
  useEffect(() => {
    if (status !== 'done') {
      setValidateStatus(null);
      setTransferAddress('');
    } else if (status === 'done') {
      if (!cfxRegistrar?.address) {
        setTransferAddress('');
        setValidateStatus('error-registrar');
      } else {
        if (chainsEncoder['Conflux Core'].validate(cfxRegistrar.address)) {
          setValidateStatus(null);
          setTransferAddress(cfxRegistrar.address);
        } else {
          setTransferAddress('');
          setValidateStatus('error-registrar-format');
        }
      }
    }
  }, [status, cfxRegistrar]);

  return (
    <div className="absolute left-11px top-[calc(100%+.5em)] h-20px flex items-center text-12px text-grey-normal">
      {status === 'done' && cfxRegistrar?.address && (
        <>
          <span className="mr-6px">域名解析:</span>
          {cfxRegistrar.address}
        </>
      )}
      {status === 'error' && (
        <span className="mr-6px text-error-normal hover:underline cursor-pointer select-none" onClick={() => getDomainRegistrar(domain)}>
          域名解析失败，点此重试
        </span>
      )}
      {(status === 'init' || status === 'update') && (
        <Delay delay={100}>
          <span className="mr-6px">域名解析:</span>
          <Spin className="text-16px" />
        </Delay>
      )}
    </div>
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
