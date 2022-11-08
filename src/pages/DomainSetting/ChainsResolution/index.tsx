import React, { useState, useCallback, Suspense } from 'react';
import Button from '@components/Button';
import Spin from '@components/Spin';
import Delay from '@components/Delay';
import { shortenAddress } from '@utils/addressUtils';
import { useDomainRegistrar } from '@service/domainRegistrar';
import usePressEsc from '@hooks/usePressEsc';

const ChainsResolution: React.FC<{ domain: string }> = ({ domain }) => {
  const [inEdit, setInEdit] = useState(false);
  const enterEdit = useCallback(() => setInEdit(true), []);
  const exitEdit = useCallback(() => setInEdit(false), []);
  usePressEsc(exitEdit);

  return (
    <div className="mt-16px flex gap-16px p-16px rounded-16px bg-purple-dark-active dropdown-shadow">
      <div className="flex items-center w-full">
        <span className="mr-auto text-14px text-purple-normal">地址解析</span>

        {inEdit && (
          <>
            <Button variant="text" size="mini" onClick={exitEdit}>
              取消
            </Button>
            <Button className="mx-8px" size="mini" onClick={exitEdit}>
              保存
            </Button>
            <Button size="mini" onClick={exitEdit}>
              添加
            </Button>
          </>
        )}
        {!inEdit && (
          <Button size="mini" onClick={enterEdit}>
            管理
          </Button>
        )}
      </div>
      
      
      <Suspense fallback={null}>
        <Chains domain={domain} />
      </Suspense>
    </div>
  );
};

const Chains: React.FC<{ domain: string }> = ({ domain }) => {
  const abc = useDomainRegistrar(domain);
  return null;
};

export default ChainsResolution;
