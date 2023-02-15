import React, { useEffect, useRef, Suspense, type MutableRefObject } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import QRCodeCreate from 'react-qr-code';
import cx from 'clsx';
import Button from '@components/Button';
import Delay from '@components/Delay';
import ToolTip from '@components/Tooltip';
import Spin from '@components/Spin';
import { resetRenewStep } from '@service/domainRenew';
import { useMakeRenewOrder, useRefreshMakeRenewOrder, useMonitorWeb2PcRenewPayStatus, useRecordOrderId, resetRenewOrderId } from '@service/domainRenew/web2/pc';
import timerNotifier from '@utils/timerNotifier';
import useIsIframeLoaded from '@hooks/useIsIframeLoaded';
import isMobile from '@utils/isMobie';

const QRCode: React.FC<{ domain: string; refreshMakeRenewOrder: VoidFunction; remainTimeDOM: MutableRefObject<HTMLSpanElement> }> = ({
  domain,
  remainTimeDOM,
  refreshMakeRenewOrder,
}) => {
  const makeRenewOrder = useMakeRenewOrder(domain);
  useRecordOrderId(domain);

  useMonitorWeb2PcRenewPayStatus({
    domain,
    id: makeRenewOrder?.id,
  });

  useEffect(() => {
    if (!remainTimeDOM.current) return;
    const timerUnit: Parameters<typeof timerNotifier.addUnit>[0] = {
      key: 'renew-web2pc-remainTime',
      type: 'second',
      update: (remainTime) => {
        if (!remainTimeDOM.current) return;
        remainTimeDOM.current.innerText = `${remainTime.minutes}:${remainTime.seconds}`;
      },
      timing: 5 * 60 * 1000,
      onEnd: () => {
        resetRenewStep(domain);
        setTimeout(() => resetRenewOrderId(domain), 16);
      },
    };
    timerNotifier.addUnit(timerUnit);

    return () => {
      timerNotifier.deleteUnit('renew-web2pc-remainTime');
    };
  }, [makeRenewOrder?.id]);

  const url = (makeRenewOrder?.trade_provider === 'wechat' ? makeRenewOrder?.code_url : makeRenewOrder?.h5_url) ?? '';
  const [iframeEle, isIframeLoaded] = useIsIframeLoaded(url);

  return (
    <div
      className={cx(
        'absolute top-0 left-1/2 -translate-x-1/2 w-100px h-100px p-6px rounded-8px bg-white cursor-pointer hover:bg-black overflow-hidden group',
        isIframeLoaded ? 'opacity-100 ' : 'opacity-0 pointer-events-none'
      )}
      onClick={refreshMakeRenewOrder}
    >
      {makeRenewOrder?.trade_provider === 'wechat' && <QRCodeCreate className="group-hover:opacity-30  pointer-events-none" size={88} value={url} viewBox={`0 0 88 88`} />}
      {makeRenewOrder?.trade_provider === 'alipay' && <iframe ref={iframeEle} className="w-100px h-100px group-hover:opacity-30 pointer-events-none border-none overflow-hidden" />}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-14px text-grey-normal font-bold opacity-0 group-hover:opacity-100 whitespace-nowrap">
        刷新二维码
      </span>
    </div>
  );
};

const QRCodePay: React.FC<{ domain: string }> = ({ domain }) => {
  const refreshMakeRenewOrder = useRefreshMakeRenewOrder(domain);
  const remainTimeDOM = useRef<HTMLSpanElement>(null!);

  return (
    <div className="mx-auto flex flex-col w-288px rounded-12px bg-violet-normal-hover overflow-hidden lt-md:w-full">
      <div className="relative mx-auto my-20px w-full h-100px flex flex-col justify-center items-center">
        <Loading />
        <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} domain={domain} />} onReset={refreshMakeRenewOrder}>
          <Suspense fallback={null}>
            <QRCode domain={domain} refreshMakeRenewOrder={refreshMakeRenewOrder} remainTimeDOM={remainTimeDOM} />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="flex flex-col justify-center items-center py-14px bg-#26233E leading-24px">
        <p className="px-20px text-center">
          请使用 {/* <span className="i-ri:wechat-pay-fill mx-4px text-24px text-#09BB07 -translate-y-1px" /> */}
          {/* <span className="i-fa6-brands:alipay mx-4px text-24px text-#009FE9 -translate-y-1px" /> */}
          支付宝扫码 支付用户名注册费
        </p>
        <p className="mt-2px flex items-center">
          请在
          <span ref={remainTimeDOM} className="contain-content inline-block mx-4px text-center text-grey-normal lt-md:text-14px lt-md:leading-24px">
            05:00
          </span>
          内完成支付
        </p>
      </div>
    </div>
  );
};

export default QRCodePay;

const Loading: React.FC = () => <Spin className="text-60px" />;

const ErrorBoundaryFallback: React.FC<FallbackProps & { domain: string }> = ({ domain, error, resetErrorBoundary }) => {
  const errorMessage = String(error);
  const isNetworkError = errorMessage.includes('Failed to fetch');

  return (
    <div className="absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center bg-violet-normal-hover">
      <ToolTip text={errorMessage}>
        <p className="mb-16px flex items-center">
          {isNetworkError ? '网络错误' : '发生了意料之外的错误'}
          <span className="i-ep:warning ml-2px text-18px flex-shrink-0" />
        </p>
      </ToolTip>

      {isNetworkError ? (
        <Button onClick={resetErrorBoundary} size="small">
          刷新二维码
        </Button>
      ) : (
        <Button onClick={() => resetRenewStep(domain)} size="small">
          回到第一步
        </Button>
      )}
    </div>
  );
};
