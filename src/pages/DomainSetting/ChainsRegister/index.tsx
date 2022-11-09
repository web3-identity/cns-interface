import React, { useState, useCallback, useMemo, useEffect, useTransition, memo, Suspense } from 'react';
import cx from 'clsx';
import Button from '@components/Button';
import Spin from '@components/Spin';
import Delay from '@components/Delay';
import Input from '@components/Input';
import ToolTip from '@components/Tooltip';
import BorderBox from '@components/Box/BorderBox';
import useClipboard from 'react-use-clipboard';
import usePressEsc from '@hooks/usePressEsc';
import useInTranscation from '@hooks/useInTranscation';
import { useDomainRegistrar, type DomainRegistrar } from '@service/domainRegistrar';
import BinanceIcon from '@assets/chains/binance.png';
import BitcoinIcon from '@assets/chains/Bitcoin.png';
import ConfluxIcon from '@assets/chains/Conflux.png';
import DogechainIcon from '@assets/chains/Dogechain.png';
import EtherClassicIcon from '@assets/chains/EtherClassic.png';
import EthereumIcon from '@assets/chains/Ethereum.png';
import SolanaIcon from '@assets/chains/Solana.png';
import showAddNewResolutionModal from './AddNewResolutionModal';
import { useRefreshRegistrar, setMultiRegistrarAddress as _setMultiRegistrarAddress } from '@service/domainRegistrar';
import { cloneDeep, isEqual } from 'lodash-es';
import './index.css';

const chainsIcon = {
  'Conflux Core': ConfluxIcon,
  Bitcoin: BitcoinIcon,
  'Ethereum/Conflux eSpace': EthereumIcon,
  Binance: BinanceIcon,
  Dogechain: DogechainIcon,
  'Ether Classic': EtherClassicIcon,
  Solana: SolanaIcon,
} as const;

const ChainsRegister: React.FC<{ domain: string }> = ({ domain }) => {
  const [inEdit, setInEdit] = useState(false);
  const enterEdit = useCallback(() => setInEdit(true), []);
  const exitEdit = useCallback(() => setInEdit(false), []);
  usePressEsc(exitEdit);

  return (
    <div className="mt-16px gap-16px p-16px rounded-16px bg-purple-dark-active dropdown-shadow">
      <Suspense fallback={null}>
        <Chains domain={domain} inEdit={inEdit} enterEdit={enterEdit} exitEdit={exitEdit} />
      </Suspense>
    </div>
  );
};

export default ChainsRegister;

interface Props {
  domain: string;
  inEdit: boolean;
  exitEdit: VoidFunction;
  enterEdit: VoidFunction;
}

const Operation: React.FC<
  Pick<Props, 'domain' | 'inEdit'> & {
    inTranscation: boolean;
    domainRegistrars: ReturnType<typeof useDomainRegistrar>;
    handleClickSave: VoidFunction;
    handleClickExit: VoidFunction;
  }
> = memo(({ domain, domainRegistrars, inEdit, inTranscation, handleClickSave, handleClickExit }) => {
  return (
    <div className="flex items-center w-full mb-4px">
      <span className="mr-auto text-14px text-purple-normal">地址解析</span>

      {inEdit && (
        <>
          {!inTranscation && (
            <Button variant="text" size="mini" onClick={handleClickExit}>
              取消
            </Button>
          )}
          <Button className="mx-8px" size="mini" onClick={handleClickSave} loading={inTranscation}>
            保存
          </Button>
        </>
      )}
      <Button size="mini" onClick={() => showAddNewResolutionModal(domain, domainRegistrars)}>
        添加
      </Button>
    </div>
  );
});

const Chains: React.FC<Props> = memo(({ domain, inEdit, enterEdit, exitEdit }) => {
  const handleRefreshRegistrar = useRefreshRegistrar(domain);
  const domainRegistrars = useDomainRegistrar(domain);
  const { inTranscation, execTranscation: setMultiRegistrarAddress } = useInTranscation(_setMultiRegistrarAddress);

  const hasRegistrarChains = useMemo(() => domainRegistrars?.filter((registrars) => !!registrars.address), [domainRegistrars]);
  const [editDomainRegistrars, setEditDomainRegistrars] = useState(() => cloneDeep(hasRegistrarChains));
  const setEditAddress = useCallback((index: number, newAddress: string) => {
    setEditDomainRegistrars((prev) => {
      prev[index].address = newAddress;
      return [...prev];
    });
  }, []);

  useEffect(() => {
    if (!inEdit && !isEqual(editDomainRegistrars, hasRegistrarChains)) {
      enterEdit();
    } else if (inEdit && isEqual(editDomainRegistrars, hasRegistrarChains)) {
      exitEdit();
    }
  }, [inEdit, editDomainRegistrars]);

  const handleClickExit = useCallback(() => {
    setEditDomainRegistrars(cloneDeep(hasRegistrarChains));
  }, [hasRegistrarChains]);

  const handleClickSave = useCallback(() => {
    const data: ReturnType<typeof useDomainRegistrar> = [];
    editDomainRegistrars.forEach(({ address, chain }, index) => {
      if (address !== hasRegistrarChains[index].address) {
        data.push({ address, chain });
      }
    });
    setMultiRegistrarAddress({
      domain,
      handleRefreshRegistrar,
      data,
    });
  }, [hasRegistrarChains, editDomainRegistrars]);

  return (
    <>
      <Operation
        domain={domain}
        domainRegistrars={domainRegistrars}
        inEdit={inEdit}
        inTranscation={inTranscation}
        handleClickExit={handleClickExit}
        handleClickSave={handleClickSave}
      />
      <div className={cx('relative flex flex-col gap-8px')}>
        {hasRegistrarChains.map((registrar, index) => (
          <Chain
            index={index}
            key={registrar.chain}
            {...registrar}
            inTranscation={inTranscation}
            editAddress={editDomainRegistrars[index].address}
            setEditAddress={setEditAddress}
          />
        ))}
      </div>
    </>
  );
});

const Chain: React.FC<DomainRegistrar & { inTranscation: boolean; editAddress: string; setEditAddress: (index: number, newAddress: string) => void; index: number }> = memo(
  ({ chain, address, index, inTranscation, editAddress, setEditAddress }) => {
    const [isCopied, copy] = useClipboard(address, { successDuration: 1300 });

    return (
      <BorderBox
        variant={editAddress !== address ? 'gradient' : 'transparent'}
        className="flex items-center w-fit px-6px h-30px rounded-20px bg-#26233E whitespace-nowrap border-1px"
      >
        <img src={chainsIcon[chain]} alt={`${chain} icon`} className="w-18px h-18px" />
        <span className="ml-4px text-14px text-grey-normal font-bold">{chain}</span>
        <div className="registrars-chain-input relative ml-8px pr-24px text-14px text-grey-normal-hover text-opacity-50">
          <span className={cx('pointer-events-none', editAddress !== address && '!opacity-0 select-none')}>{address}</span>
          {editAddress !== address && <span className="absolute left-0 top-0 w-full h-full pointer-events-none select-none">{editAddress}</span>}
          <Input
            size="small"
            wrapperClassName="absolute left-0 top-0 w-full h-full opacity-0 select-none"
            className="!px-0 !h-full !text-grey-normal !text-opacity-50 font-normal"
            value={editAddress}
            onChange={(evt) => setEditAddress(index, evt.target.value)}
            disabled={inTranscation}
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
