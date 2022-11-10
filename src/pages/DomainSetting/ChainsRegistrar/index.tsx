import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import cx from 'clsx';
import { cloneDeep, isEqual } from 'lodash-es';
import Button from '@components/Button';
import Spin from '@components/Spin';
import Delay from '@components/Delay';
import Input from '@components/Input';
import ToolTip from '@components/Tooltip';
import BorderBox from '@components/Box/BorderBox';
import useClipboard from 'react-use-clipboard';
import usePressEsc from '@hooks/usePressEsc';
import useInTranscation from '@hooks/useInTranscation';
import { useIsOwner } from '@service/domainInfo';
import {
  getDomainRegistrar,
  useDomainRegistrar,
  setMultiRegistrarAddress as _setMultiRegistrarAddress,
  type Chain,
  type Status,
  type DomainRegistrar,
} from '@service/domainRegistrar';
import BinanceIcon from '@assets/chains/Binance.png';
import BitcoinIcon from '@assets/chains/Bitcoin.png';
import ConfluxIcon from '@assets/chains/Conflux.png';
import DogechainIcon from '@assets/chains/Dogechain.png';
import EtherClassicIcon from '@assets/chains/EtherClassic.png';
import EthereumIcon from '@assets/chains/Ethereum.png';
import SolanaIcon from '@assets/chains/Solana.png';
import FlowIcon from '@assets/chains/Flow.png';
import showAddNewResolutionModal from './AddNewResolutionModal';
import './index.css';

const chainsIcon = {
  'Conflux Core': ConfluxIcon,
  Bitcoin: BitcoinIcon,
  'Ethereum/Conflux eSpace': EthereumIcon,
  Binance: BinanceIcon,
  Dogechain: DogechainIcon,
  'Ether Classic': EtherClassicIcon,
  Solana: SolanaIcon,
  Flow: FlowIcon,
} as const;

const ChainsRegistrar: React.FC<{ domain: string }> = ({ domain }) => {
  const { status, domainRegistrars } = useDomainRegistrar(domain);

  if (status === 'init') return <ChainsLoading />;
  if (status === 'error' && !domainRegistrars) return <ErrorBoundary domain={domain} />;
  if (!domainRegistrars) return null;
  return <Chains domain={domain} domainRegistrars={domainRegistrars} status={status} />;
};

const ErrorBoundary: React.FC<{ domain: string }> = ({ domain }) => {
  return (
    <div className="relative mt-16px gap-16px p-16px min-h-140px rounded-16px bg-purple-dark-active dropdown-shadow">
      <div className="flex items-center w-full mb-4px h-28px">
        <span className="mr-auto text-14px text-purple-normal">地址解析</span>
      </div>
      <p className="mt-12px mb-12px text-center text-14px text-grey-normal">数据拉取失败</p>
      <Button size="mini" className="flex mx-auto" onClick={() => getDomainRegistrar(domain)}>
        重试
      </Button>
    </div>
  );
};

const ChainsLoading: React.FC = () => {
  return (
    <Delay>
      <div className="relative mt-16px gap-16px p-16px min-h-140px rounded-16px bg-purple-dark-active dropdown-shadow">
        <div className="flex items-center w-full mb-4px h-28px">
          <span className="mr-auto text-14px text-purple-normal">地址解析</span>
        </div>
        <Spin className="mt-12px mx-auto text-48px" />
      </div>
    </Delay>
  );
};

export default ChainsRegistrar;

const Operation: React.FC<{
  domain: string;
  inEdit: boolean;
  inTranscation: boolean;
  isOwner: boolean | null;
  editDomainRegistrars: Array<DomainRegistrar>;
  domainRegistrars: Array<DomainRegistrar>;
  setEditAddress: (chain: Chain, newAddress: string) => void;
  handleClickSave: VoidFunction;
  handleClickExit: VoidFunction;
}> = memo(({ domain, isOwner, domainRegistrars, editDomainRegistrars, inEdit, inTranscation, setEditAddress, handleClickSave, handleClickExit }) => {
  const registrableChains = useMemo(() => editDomainRegistrars.filter(({ address }, index) => !address && !domainRegistrars?.[index]?.address), [editDomainRegistrars]);

  return (
    <div className="flex items-center w-full mb-4px h-28px">
      <span className="mr-auto text-14px text-purple-normal">地址解析</span>

      {isOwner && inEdit && (
        <>
          {!inTranscation && (
            <Button variant="text" size="mini" onClick={handleClickExit}>
              取消
            </Button>
          )}
          <Button className="mx-8px" size="mini" onClick={handleClickSave}>
            保存
          </Button>
        </>
      )}
      {isOwner && registrableChains?.length > 0 && (
        <Button
          size="mini"
          onClick={() =>
            showAddNewResolutionModal({
              domain,
              registrableChains,
              setEditAddress,
            })
          }
        >
          添加
        </Button>
      )}
    </div>
  );
});

const Chains: React.FC<{ domain: string; status: Status; domainRegistrars: Array<DomainRegistrar> }> = memo(({ status, domain, domainRegistrars }) => {
  const isOwner = useIsOwner(domain);
  const [inEdit, setInEdit] = useState(false);
  const enterEdit = useCallback(() => setInEdit(true), []);
  const exitEdit = useCallback(() => setInEdit(false), []);
  usePressEsc(exitEdit);

  const { inTranscation, execTranscation: setMultiRegistrarAddress } = useInTranscation(_setMultiRegistrarAddress);

  const hasRegistrarChains = useMemo(() => domainRegistrars?.filter((registrars) => !!registrars.address), [domainRegistrars]);
  const [editDomainRegistrars, setEditDomainRegistrars] = useState(() => cloneDeep(domainRegistrars));
  useEffect(() => setEditDomainRegistrars(cloneDeep(domainRegistrars)), [domainRegistrars]);

  useEffect(() => {
    if (!inEdit && !isEqual(editDomainRegistrars, domainRegistrars)) {
      enterEdit();
    } else if (inEdit && isEqual(editDomainRegistrars, domainRegistrars)) {
      exitEdit();
    }
  }, [inEdit, editDomainRegistrars]);

  const setEditAddress = useCallback((chain: Chain, newAddress: string) => {
    setEditDomainRegistrars((prev) => {
      const chainIndex = prev.findIndex((registrars) => registrars.chain === chain);
      if (chainIndex === -1) return prev;
      prev[chainIndex].address = newAddress;
      return [...prev];
    });
  }, []);

  const handleClickExit = useCallback(() => {
    setEditDomainRegistrars(cloneDeep(domainRegistrars));
  }, [domainRegistrars]);

  const handleClickSave = useCallback(() => {
    const data: Array<DomainRegistrar> = [];
    editDomainRegistrars.forEach(({ address, chain }, index) => {
      if (address !== domainRegistrars[index].address) {
        data.push({ address, chain });
      }
    });

    setMultiRegistrarAddress({
      domain,
      data,
    });
  }, [editDomainRegistrars]);

  return (
    <div className={cx('relative mt-16px gap-16px p-16px rounded-16px bg-purple-dark-active dropdown-shadow', !hasRegistrarChains?.length && 'min-h-140px ')}>
      <Operation
        domain={domain}
        isOwner={isOwner}
        domainRegistrars={domainRegistrars}
        editDomainRegistrars={editDomainRegistrars}
        inEdit={inEdit}
        inTranscation={inTranscation}
        handleClickExit={handleClickExit}
        handleClickSave={handleClickSave}
        setEditAddress={setEditAddress}
      />
      {!hasRegistrarChains?.length && <p className="mt-32px text-center text-14px text-grey-normal">尚未添加地址解析</p>}
      <div className="relative flex flex-col gap-8px">
        {domainRegistrars.map((registrar, index) => (
          <ChainItem
            key={registrar.chain}
            {...registrar}
            disabled={inTranscation || !isOwner}
            editAddress={editDomainRegistrars?.[index]?.address ?? ''}
            setEditAddress={setEditAddress}
          />
        ))}
      </div>
      {(status === 'update' || status === 'error') && (
        <Delay>
          <div className="!absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center bg-purple-dark-active bg-opacity-75">
            {status === 'update' && <Spin className="text-48px" />}
            {status === 'error' && (
              <>
                <p className="mt-12px mb-12px text-center text-14px text-grey-normal">数据更新失败</p>
                <Button size="mini" className="flex mx-auto mb-12px" onClick={() => getDomainRegistrar(domain)}>
                  重试
                </Button>
              </>
            )}
          </div>
        </Delay>
      )}
    </div>
  );
});

const ChainItem: React.FC<DomainRegistrar & { disabled: boolean; editAddress: string; setEditAddress: (chain: Chain, newAddress: string) => void }> = memo(
  ({ chain, address, disabled, editAddress, setEditAddress }) => {
    const [isCopied, copy] = useClipboard(address, { successDuration: 1300 });

    if (!editAddress && !address) return null;
    return (
      <BorderBox
        variant={editAddress?.trim() !== address?.trim() ? 'gradient' : 'transparent'}
        className="flex items-center w-fit px-6px h-30px rounded-20px bg-#26233E whitespace-nowrap border-1px"
      >
        <img src={chainsIcon[chain]} alt={`${chain} icon`} className="w-18px h-18px" />
        <span className="ml-4px text-14px text-grey-normal font-bold">{chain}</span>
        <div className="registrars-chain-input relative ml-8px pr-24px text-14px text-grey-normal-hover text-opacity-50">
          <span className={cx('pointer-events-none', editAddress !== address && '!opacity-0 select-none')}>{address || editAddress}</span>
          {editAddress !== address && <span className="absolute left-0 top-0 w-full h-full pointer-events-none select-none">{editAddress}</span>}
          <Input
            size="small"
            wrapperClassName="absolute left-0 top-0 w-full h-full opacity-0 select-none"
            className="!px-0 !h-full !text-grey-normal !text-opacity-50 font-normal"
            value={editAddress}
            onChange={(evt) => setEditAddress(chain, evt.target.value)}
            disabled={disabled}
          />
        </div>

        <ToolTip visible={isCopied} text="复制成功">
          <span
            className="flex justify-center items-center w-18px h-18px  rounded-full bg-purple-dark-active hover:bg-purple-dark-hover cursor-pointer transition-colors"
            onClick={copy}
          >
            <span className="i-bxs:copy-alt text-12px text-#838290" />
          </span>
        </ToolTip>
      </BorderBox>
    );
  }
);
