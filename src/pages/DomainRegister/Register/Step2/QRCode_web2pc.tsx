import React, { useEffect, Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import QRCodeCreate from 'react-qr-code';
import cx from 'clsx';
import Button from '@components/Button';
import Delay from '@components/Delay';
import ToolTip from '@components/Tooltip';
import Spin from '@components/Spin';
import useInTranscation from '@hooks/useInTranscation';
import { backToStep1 } from '@service/domainRegister';
import { useMakeOrder, useRefreshMakeOrder, refreshRegisterOrder as _refreshRegisterOrder } from '@service/domainRegister/pay/web2/pc';
import useIsIframeLoaded from '@hooks/useIsIframeLoaded';

const QRCode: React.FC<{ domain: string; refreshMakeOrder: VoidFunction }> = ({ domain, refreshMakeOrder }) => {
  const makeOrder = useMakeOrder(domain);
  const { inTranscation, execTranscation: refreshRegisterOrder } = useInTranscation(_refreshRegisterOrder);

  useEffect(() => {
    const timer = setInterval(async () => {
      await refreshRegisterOrder(domain);
      refreshMakeOrder();
    }, 1000 * 60 * 5);

    return () => clearInterval(timer);
  }, []);

  const url = (makeOrder?.trade_provider === 'wechat' ? makeOrder?.code_url : makeOrder?.h5_url) ?? '';
  const [iframeEle, isIframeLoaded] = useIsIframeLoaded(url);

  return (
    <div
      className={cx(
        'absolute left-0 top-0 w-100px h-100px p-6px rounded-8px bg-white cursor-pointer hover:bg-black overflow-hidden group',
        !inTranscation && isIframeLoaded ? 'opacity-100 ' : 'opacity-0 pointer-events-none'
      )}
      onClick={async () => {
        await refreshRegisterOrder(domain);
        refreshMakeOrder();
      }}
    >
      {makeOrder?.trade_provider === 'wechat' && <QRCodeCreate className="group-hover:opacity-30  pointer-events-none" size={88} value={url} viewBox={`0 0 88 88`} />}
      {makeOrder?.trade_provider === 'alipay' && <iframe ref={iframeEle} className="w-100px h-100px group-hover:opacity-30 pointer-events-none border-none overflow-hidden" />}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-14px text-grey-normal font-bold opacity-0 group-hover:opacity-100 whitespace-nowrap">
        刷新二维码
      </span>
    </div>
  );
};

const QRCodePay: React.FC<{ domain: string }> = ({ domain }) => {
  const refreshMakeOrder = useRefreshMakeOrder(domain);

  return (
    <div className="relative mx-auto my-20px w-100px h-100px flex flex-col justify-center items-center">
      <Loading />
      <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} domain={domain} />} onReset={refreshMakeOrder}>
        <Suspense fallback={null}>
          <QRCode domain={domain} refreshMakeOrder={refreshMakeOrder} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default QRCodePay;

const Loading: React.FC = () => <Spin className="text-60px" />;

const ErrorBoundaryFallback: React.FC<FallbackProps & { domain: string }> = ({ domain, error, resetErrorBoundary }) => {
  const errorMessage = String(error);
  const isNetworkError = errorMessage.includes('Failed to fetch');

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <ToolTip text={errorMessage}>
        <p className="mb-16px flex items-center">
          {isNetworkError ? '网络错误' : '发生了意料之外的错误'}
          <span className="i-ep:warning ml-2px text-18px" />
        </p>
      </ToolTip>

      {isNetworkError ? (
        <Button onClick={resetErrorBoundary} size="small">
          刷新二维码
        </Button>
      ) : (
        <Button onClick={() => backToStep1(domain)} size="small">
          回到第一步
        </Button>
      )}
    </div>
  );
};
