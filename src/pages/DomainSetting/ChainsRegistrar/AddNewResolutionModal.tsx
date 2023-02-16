import React, { useState, useCallback, useMemo } from 'react';
import cx from 'clsx';
import { useForm } from 'react-hook-form';
import CustomScrollbar from 'custom-react-scrollbar';
import Button from '@components/Button';
import Dropdown from '@components/Dropdown';
import { showModal, showDrawer, hideAll } from '@components/showPopup';
import Input from '@components/Input';
import usePressEsc from '@hooks/usePressEsc';
import isMobile from '@utils/isMobie';
import { chainsEncoder, type Chain, type DomainRegistrar } from '@service/domainRegistrar';

interface Props {
  domain: string;
  registrableChains: Array<DomainRegistrar>;
  setEditAddress: (chain: Chain, newAddress: string) => void;
}

const ModalContent: React.FC<Props> = ({ setEditAddress, registrableChains }) => {
  const {
    register,
    handleSubmit: withForm,
    setValue,
    formState: {
      errors: { address: error },
    },
  } = useForm();
  const [savedChains, setSavedChains] = useState<Array<Chain>>([]);

  const [visible, setVisible] = useState(false);
  const hideDropdown = useCallback(() => setVisible(false), []);
  const triggerDropdown = useCallback(() => setVisible((pre) => !pre), []);
  usePressEsc(hideDropdown);

  const [selectedChain, setSelectedChain] = React.useState(() => registrableChains[0].chain);
  const selectableChains = useMemo(
    () => registrableChains.map(({ chain }) => chain).filter((chain) => chain !== selectedChain && !savedChains?.includes(chain)),
    [selectedChain, registrableChains]
  );

  const selectChain = useCallback((chain: Chain) => {
    setVisible(false);
    setTimeout(() => setSelectedChain(chain), 32);
  }, []);

  const handleSetRegistrarAddress = useCallback(
    withForm(({ address }) => {
      setEditAddress(selectedChain, address);
      setSavedChains((prev) => {
        prev.push(selectedChain);
        return [...prev];
      });
      setValue('address', '');
      if (selectableChains.length === 0) {
        hideAll();
      } else {
        setSelectedChain(selectableChains[0]);
      }
    }),
    [selectableChains]
  );

  return (
    <form onSubmit={handleSetRegistrarAddress}>
      <div className="pt-24px lt-md:pt-16px md:grid md:grid-rows-[18px_50px] md:grid-cols-[38.4%_61.6%] md:gap-y-16px">
        <p className="text-14px text-grey-normal-hover text-opacity-50 lt-md:mb-8px lt-md:text-12px">选择公链</p>
        <p className="text-14px text-grey-normal-hover text-opacity-50 lt-md:display-none">填写地址</p>

        <Dropdown
          className="border-2px border-purple-normal rounded-8px bg-purple-dark-active overflow-hidden dropdown-shadow"
          visible={visible}
          onClickOutside={hideDropdown}
          disabled={selectableChains?.length <= 0}
          Content={<ChainSelect selectableChains={selectableChains} selectChain={selectChain} />}
        >
          <div
            className={cx(
              'flex items-center pl-8px pr-12px h-full lt-md:h-32px md:rounded-l-10px lt-md:rounded-6px border-2px border-purple-normal text-14px text-grey-normal whitespace-nowrap',
              selectableChains?.length >= 1 && 'cursor-pointer'
            )}
            onClick={triggerDropdown}
          >
            {selectedChain}
            {selectableChains?.length >= 1 && <span className={cx('ml-auto i-ant-design:caret-down-outlined text-16px transition-transform flex-shrink-0', visible && 'rotate-180')} />}
          </div>
        </Dropdown>

        <p className="text-12px text-grey-normal-hover text-opacity-50 mt-16px mb-8px md:display-none">填写地址</p>
        <div className="relative flex items-center h-full lt-md:h-32px md:rounded-r-10px lt-md:rounded-6px border-2px md:!border-l-none border-purple-normal text-14px text-grey-normal">
          <Input
            id="register-address"
            className="!lt-md:pl-8px"
            size="small"
            placeholder="请输入地址"
            autoFocus
            {...register('address', { required: true, validate: chainsEncoder[selectedChain].validate })}
          />
          {error?.type === 'validate' && <span className="absolute left-7px top-[calc(100%+.75em)] text-12px text-error-normal">地址格式错误</span>}
        </div>
      </div>

      <div className="mt-140px lt-md:mt-108px flex justify-center items-center gap-16px">
        <Button variant="outlined" className="min-w-152px" onClick={hideAll} type="button">
          返回
        </Button>
        <Button className="min-w-152px">暂存</Button>
      </div>
    </form>
  );
};

const ChainSelect: React.FC<{ selectableChains: Array<string>; selectChain: Function }> = ({ selectableChains, selectChain }) => {
  return (
    <CustomScrollbar className="max-h-264px">
      {selectableChains.map((chain) => (
        <div
          key={chain}
          className="pl-8px h-48px leading-48px hover:bg-[#26233E] text-14px text-grey-normal cursor-pointer transition-colors whitespace-nowrap"
          onClick={() => selectChain(chain)}
        >
          {chain}
        </div>
      ))}
    </CustomScrollbar>
  );
};

const showAddNewResolutionModal = (params: Props) => {
  if (isMobile) {
    showDrawer({ Content: <ModalContent {...params} />, title: '新增解析地址' });
  } else {
    showModal({ Content: <ModalContent {...params} />, title: '新增解析地址' });
  }
};

export default showAddNewResolutionModal;
