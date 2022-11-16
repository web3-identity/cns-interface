import React, { useState, useCallback, useMemo } from 'react';
import cx from 'clsx';
import { useForm } from 'react-hook-form';
import Button from '@components/Button';
import Dropdown from '@components/Dropdown';
import { showModal, showDrawer, hideAllModal } from '@components/showPopup';
import Input from '@components/Input';
import usePressEsc from '@hooks/usePressEsc';
import { shortenAddress } from '@utils/addressUtils';
import isMobile from '@utils/isMobie';

interface Props {
  account: string;
}

const ModalContent: React.FC<Props> = ({ account }) => {
  return (
    <>
      <p className='mt-24px mb-8px leading-18px text-14px text-grey-normal-hover text-opacity-50'>当前账户地址</p>
      <p className='leading-18px text-14px text-grey-normal'>{!isMobile() ? account : shortenAddress(account)}</p>

      <p className='mt-24px mb-8px leading-18px text-14px text-grey-normal-hover text-opacity-50'>选择.Web3域名</p>
    </>
  );
};

const ChainSelect: React.FC<{ selectableChains: Array<string>; selectChain: Function }> = ({ selectableChains, selectChain }) => {
  return (
    <>
      {selectableChains.map((chain) => (
        <div key={chain} className="pl-8px h-48px leading-48px hover:bg-[#26233E] text-14px text-grey-normal cursor-pointer transition-colors" onClick={() => selectChain(chain)}>
          {chain}
        </div>
      ))}
    </>
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
