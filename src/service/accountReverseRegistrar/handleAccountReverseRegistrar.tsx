import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast, hideToast } from '@components/showPopup';
import Domain from '@modules/Domain';
import { fetchConfluxCoreRegistrar } from '@service/domainRegistrar';
import { getAccount } from '@service/account';
import useInTranscation from '@hooks/useInTranscation';
import { setAccountReverseRegistrar, getAccountReverseRegistrar, useRefreshAccountReverseRegistrar } from '.';

export const useHandleSetAccountReverseRegistrar = (domain: string) => {
  const navigate = useNavigate();
  const refreshAccountReverseRegistrar = useRefreshAccountReverseRegistrar();

  return useCallback(() => {
    handleSetAccountReverseRegistrar({ domain, navigate, refreshAccountReverseRegistrar, from: 'setting' });
  }, [domain]);
};

export const handleSetAccountReverseRegistrar = async ({
  domain,
  navigate,
  refreshAccountReverseRegistrar,
  from = 'my-domains',
}: {
  domain: string;
  navigate: ReturnType<typeof useNavigate>;
  refreshAccountReverseRegistrar: VoidFunction;
  from: 'setting' | 'my-domains';
}) => {
  const currentReverseRegistrar = await getAccountReverseRegistrar();
  const confluxCoreRegistrar = await fetchConfluxCoreRegistrar(domain);
  const currentAccount = getAccount()!;

  if (currentReverseRegistrar === domain) {
    showToast(
      <>
        <p>
          域名 <Domain domain={domain} /> 已是 .web3 域名
        </p>
      </>,
      { type: 'warning', key: `Registrar-already-${domain}` }
    );
    return;
  }

  if (confluxCoreRegistrar !== currentAccount) {
    hideToast(`Registrar-check-${domain}-${from === 'setting' ? 'my-domains' : 'setting'}`);
    const toastKey = showToast(
      <>
        <p>必须先将当前账户地址设置到</p>
        <p>
          域名 <Domain domain={domain} /> 的解析里！
          {from === 'my-domains' && (
            <span
              className="text-white underline underline-offset-3px cursor-pointer"
              onClick={() => {
                navigate(`/setting/${domain}`);
                toastKey && hideToast(toastKey);
              }}
            >
              去设置
            </span>
          )}
        </p>
      </>,
      { type: 'warning', key: `Registrar-check-${domain}-${from}` }
    );
  } else {
    try {
      await setAccountReverseRegistrar(domain);
      await refreshAccountReverseRegistrar();
      showToast(`设置 ${domain}.web3 为 .web3域名成功！`, { type: 'success' });
    } catch (_) {}
  }
};
