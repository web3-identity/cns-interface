import React, { useState, useCallback, useTransition, useMemo } from 'react';
import cx from 'clsx';
import CustomScrollbar from 'custom-react-scrollbar';
import { escapeRegExp } from 'lodash-es';
import Button from '@components/Button';
import Dropdown from '@components/Dropdown';
import { showModal, showDrawer, hideAllModal } from '@components/showPopup';
import Input from '@components/Input';
import usePressEsc from '@hooks/usePressEsc';
import useInTranscation from '@hooks/useInTranscation';
import { setDomainReverseRegistrar as _setDomainReverseRegistrar, useRefreshDomainReverseRegistrar } from '@service/domainReverseRegistrar';
import { shortenAddress } from '@utils/addressUtils';
import isMobile from '@utils/isMobie';

interface Props {
  account: string;
  domainReverseRegistrar: string | null;
  myDomains: Array<string>;
}

const ModalContent: React.FC<Props> = ({ account, domainReverseRegistrar, myDomains = [] }) => {
  const { inTranscation, execTranscation: setDomainReverseRegistrar } = useInTranscation(_setDomainReverseRegistrar);
  const refreshDomainReverseRegistrar = useRefreshDomainReverseRegistrar();

  const [visible, setVisible] = useState(false);
  const showDropdown = useCallback(() => !inTranscation && setVisible(true), [inTranscation]);
  const hideDropdown = useCallback(() => !inTranscation && setVisible(false), [inTranscation]);
  usePressEsc(hideDropdown);

  const [_, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(() => '');
  const [filter, setFilter] = useState(() => inputValue);
  const [choseEmpty, setChoseEmpty] = useState(false);
  const handleInputChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.target.value);
    setChoseEmpty(false);
    startTransition(() => {
      setFilter(evt.target.value);
    });
  }, []);

  const selectableDomains = useMemo(
    () => [
      ...(!!domainReverseRegistrar ? [''] : []),
      ...myDomains.filter(
        (domain) =>
          domain !== domainReverseRegistrar &&
          domain !== inputValue &&
          (domain.search(new RegExp(escapeRegExp(filter), 'i')) !== -1 || filter.search(new RegExp(escapeRegExp(domain), 'i')) !== -1)
      ),
    ],
    [inputValue, filter, myDomains, domainReverseRegistrar]
  );

  const selectDomain = useCallback((domain: string) => {
    setVisible(false);
    setTimeout(() => {
      setInputValue(domain);
      setFilter('');
      setChoseEmpty(domain === '');
    }, 80);
  }, []);

  const isInputValueValid = useMemo(() => !inputValue || !!myDomains.find((domain) => domain === inputValue), [inputValue, myDomains]);
  const canOnlySetEmpty = useMemo(() => !!domainReverseRegistrar && myDomains?.length === 1 && myDomains[0] === domainReverseRegistrar, [domainReverseRegistrar, myDomains]);

  return (
    <>
      <p className="mt-24px mb-8px leading-18px text-14px text-grey-normal-hover text-opacity-50">当前账户地址</p>
      <p className="leading-18px text-14px text-grey-normal">{!isMobile() ? account : shortenAddress(account)}</p>

      <p className="mt-24px mb-8px leading-18px text-14px text-grey-normal-hover text-opacity-50">选择.Web3域名</p>
      <Dropdown
        className="border-2px border-purple-normal rounded-8px bg-purple-dark-active overflow-hidden dropdown-shadow"
        visible={visible}
        onClickOutside={hideDropdown}
        disabled={!selectableDomains?.length || canOnlySetEmpty || inTranscation}
        Content={<DomainSelect selectableDomains={selectableDomains} selectDomain={selectDomain} />}
      >
        <div
          className={cx(
            'relative flex items-center pr-16px rounded-6px border-2px border-purple-normal text-14px text-grey-normal',
            !canOnlySetEmpty && !inTranscation && 'cursor-pointer'
          )}
          onClick={showDropdown}
        >
          <Input
            value={inputValue}
            onChange={handleInputChange}
            className="!pl-16px"
            placeholder={(choseEmpty || canOnlySetEmpty) ? '设置为空' : '请选择.web3域名'}
            disabled={canOnlySetEmpty || inTranscation}
            onFocus={showDropdown}
          />
          {!canOnlySetEmpty && selectableDomains?.length >= 1 && (
            <span className={cx('ml-auto i-ant-design:caret-down-outlined text-16px transition-transform', visible && 'rotate-180')} />
          )}
          {!visible && !isInputValueValid && <span className="absolute left-7px top-[calc(100%+.75em)] text-12px text-error-normal">请选择一个域名</span>}
        </div>
      </Dropdown>

      <div className="mt-132px flex justify-center items-center gap-16px">
        <Button variant="outlined" className="min-w-152px" onClick={hideAllModal} type="button" disabled={inTranscation}>
          取消
        </Button>
        <Button
          className="min-w-152px"
          onClick={() => isInputValueValid && setDomainReverseRegistrar({ domain: inputValue, refreshDomainReverseRegistrar })}
          loading={inTranscation}
        >
          保存
        </Button>
      </div>
    </>
  );
};

const DomainSelect: React.FC<{ selectableDomains: Array<string>; selectDomain: Function }> = ({ selectableDomains, selectDomain }) => {
  return (
    <CustomScrollbar className="max-h-264px">
      {selectableDomains.map((domain) => (
        <div
          key={domain}
          className="pl-8px h-48px leading-48px hover:bg-[#26233E] text-14px text-grey-normal cursor-pointer transition-colors"
          onClick={() => selectDomain(domain)}
        >
          {domain || '设置为空'}
        </div>
      ))}
    </CustomScrollbar>
  );
};

const showSetReverseRegistrarModal = (params: Props) => {
  if (isMobile()) {
    showDrawer({ Content: <ModalContent {...params} />, title: '设置反向解析' });
  } else {
    showModal({ Content: <ModalContent {...params} />, title: '设置反向解析' });
  }
};

export default showSetReverseRegistrarModal;
