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
import { useMakeOrder, useRefreshMakeOrder, refreshRegisterOrder as _refreshRegisterOrder } from '@service/domainRegister/pay/web2';
import useIsIframeLoaded from '@hooks/useIsIframeLoaded';
import isMobile from '@utils/isMobie';

const OrderMaker: React.FC<{ domain: string; refreshMakeOrder: VoidFunction }> = ({ domain, refreshMakeOrder }) => {
  const makeOrder = useMakeOrder(domain);
  const { inTranscation, execTranscation: refreshRegisterOrder } = useInTranscation(_refreshRegisterOrder);

  useEffect(() => {
    const timer = setInterval(async () => {
      await refreshRegisterOrder(domain);
      refreshMakeOrder();
    }, 1000 * 60 * 5);

    return () => clearInterval(timer);
  }, []);

  const url = (isMobile ? makeOrder?.wap_url : makeOrder?.trade_provider === 'wechat' ? makeOrder?.code_url : makeOrder?.h5_url) ?? '';
  const [iframeEle, isIframeLoaded] = useIsIframeLoaded(url);

  if (isMobile) {
    return (
      <Button fullWidth target="_blank" href={url} className="absolute left-0 top-0">
        <span className="i-fa6-brands:alipay mx-4px text-24px text-#009FE9" />
        支付宝支付
      </Button>
    );
  }

  return (
    <div
      className={cx(
        'absolute top-0 left-1/2 -translate-x-1/2 w-100px h-100px p-6px rounded-8px bg-white cursor-pointer hover:bg-black overflow-hidden group',
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

const Web2Pay: React.FC<{ domain: string }> = ({ domain }) => {
  const refreshMakeOrder = useRefreshMakeOrder(domain);

  return (
    <div className={cx(isMobile ? 'relative w-full min-h-40px' : 'relative mx-auto my-20px w-full h-100px flex flex-col justify-center items-center')}>
      <Loading />
      <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} domain={domain} />} onReset={refreshMakeOrder}>
        <Suspense fallback={null}>
          <OrderMaker domain={domain} refreshMakeOrder={refreshMakeOrder} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Web2Pay;

const Loading: React.FC = () =>
  isMobile ? (
    <Button fullWidth loading className="absolute bottom-0 pointer-events-none" />
  ) : (
    <Delay mode="opacity">
      <Spin className="text-60px" />
    </Delay>
  );

const ErrorBoundaryFallback: React.FC<FallbackProps & { domain: string }> = ({ domain, error, resetErrorBoundary }) => {
  const errorMessage = String(error);
  const isNetworkError = errorMessage.includes('Failed to fetch');

  return (
    <div className={cx('w-full flex flex-col justify-center items-center bg-violet-normal-hover lt-md:bg-purple-dark-active', !isMobile && 'absolute left-0 top-0 h-full')}>
      <ToolTip text={errorMessage}>
        <p className={cx('mb-16px flex items-center underline underline-offset-3px', isMobile && 'mt-16px')}>
          {isNetworkError ? '网络错误' : `发生了意料之外的错误${isMobile ? '，点此查看' : ''}`}
          <span className="i-ep:warning ml-2px text-18px flex-shrink-0" />
        </p>
      </ToolTip>

      {isNetworkError ? (
        <Button onClick={resetErrorBoundary} size={!isMobile ? 'small' : 'normal'} fullWidth={isMobile}>
          刷新二维码
        </Button>
      ) : (
        <Button onClick={() => backToStep1(domain)} size={!isMobile ? 'small' : 'normal'} fullWidth={isMobile}>
          回到第一步
        </Button>
      )}
    </div>
  );
};
