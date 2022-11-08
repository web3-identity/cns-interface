import React, { useEffect, Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import QRCodeCreate from 'react-qr-code';
import Button from '@components/Button';
import Delay from '@components/Delay';
import ToolTip from '@components/Tooltip';
import Spin from '@components/Spin';
import useInTranscation from '@hooks/useInTranscation';
import { backToStep1 } from '@service/domainRegister';
import { useMakeOrder, useRefreshMakeOrder, refreshRegisterOrder as _refreshRegisterOrder } from '@service/domainRegister/pay/web2/pc';

const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

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

  if (inTranscation) return <Loading />;
  return (
    <div
      className="relative w-100px h-100px p-6px rounded-8px bg-white cursor-pointer hover:bg-black hover:bg-opacity-30 group"
      onClick={async () => {
        await refreshRegisterOrder(domain);
        refreshMakeOrder();
      }}
    >
      <QRCodeCreate className="group-hover:opacity-30  pointer-events-none" size={88} value={makeOrder?.code_url || ''} viewBox={`0 0 88 88`} fgColor={isDarkMode() ? "green" : undefined} />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-14px text-grey-normal font-bold opacity-0 group-hover:opacity-100">刷新二维码</span>
    </div>
  );
};

const QRCodePay: React.FC<{ domain: string }> = ({ domain }) => {
  const refreshMakeOrder = useRefreshMakeOrder(domain);

  return (
    <div className="mx-auto my-20px h-100px flex flex-col justify-center items-center">
      <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} domain={domain} />} onReset={refreshMakeOrder}>
        <Suspense fallback={<Loading />}>
          <QRCode domain={domain} refreshMakeOrder={refreshMakeOrder} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default QRCodePay;

const Loading: React.FC = () => (
  <Delay mode="opacity">
    <Spin className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-60px" />
  </Delay>
);

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
