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

  const _handleSetAccountReverseRegistrar = useCallback(() => handleSetAccountReverseRegistrar({ domain, navigate, refreshAccountReverseRegistrar, from: 'setting' }), [domain]);

  const { inTranscation, execTranscation} = useInTranscation(_handleSetAccountReverseRegistrar);

  return {
    inTranscation,
    handleSetAccountReverseRegistrar: execTranscation
  } as const;
};

export const handleSetAccountReverseRegistrar = async ({
  domain,
  navigate,
  refreshAccountReverseRegistrar,
  from = 'my-domains',
  inTransitionCallback,
}: {
  domain: string;
  navigate: ReturnType<typeof useNavigate>;
  refreshAccountReverseRegistrar: VoidFunction;
  from: 'setting' | 'my-domains';
  inTransitionCallback?: VoidFunction;
}) => {
  const currentReverseRegistrar = await getAccountReverseRegistrar();
  const confluxCoreRegistrar = await fetchConfluxCoreRegistrar(domain);
  const currentAccount = getAccount()!;

  if (currentReverseRegistrar === domain) {
    showToast(
      <>
        <p>
          用户名 <Domain domain={domain} /> 已是 .web3 用户名
        </p>
      </>,
      { type: 'warning', key: `Registrar-already-${domain}` }
    );
    return;
  }

  if (domain && confluxCoreRegistrar !== currentAccount) {
    hideToast(`Registrar-check-${domain}-${from === 'setting' ? 'my-domains' : 'setting'}`);
    const toastKey = showToast(
      <>
        <p>必须先将当前账户地址设置到</p>
        <p>
          用户名 <Domain domain={domain} /> 的解析里！
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
      inTransitionCallback?.();
      await setAccountReverseRegistrar(domain);
      await refreshAccountReverseRegistrar();
      showToast(!!domain ? `设置 ${domain} 为 .web3用户名 成功！` : '取消展示成功！', { type: 'success' });
    } catch (_) {}
  }
};
