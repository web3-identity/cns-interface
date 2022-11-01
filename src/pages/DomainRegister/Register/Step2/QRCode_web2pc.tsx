import React, { Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import QRCodeCreate from 'react-qr-code';
import Button from '@components/Button';
import { useMakeOrder, refreshRegisterOrder } from '@service/domainRegister/pay/web2/pc';

const QRCode: React.FC<{ domain: string }> = ({ domain }) => {
  const makeOrder = useMakeOrder(domain);
  console.log(makeOrder);
  return (
    <div className='w-100px h-100px p-6px rounded-8px bg-white'>
      <QRCodeCreate size={88} value={makeOrder?.code_url || ''} viewBox={`0 0 88 88`} />;
    </div>
  );
};

const QRCodePay: React.FC<{ domain: string }> = ({ domain }) => {
  return (
    <div className="mx-auto my-20px w-100px h-100px">
      <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} domain={domain} />}>
        <Suspense fallback={null}>
          <QRCode domain={domain} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default QRCodePay;

const ErrorBoundaryFallback: React.FC<FallbackProps & { domain: string }> = ({ resetErrorBoundary, domain, error }) => {
  const needRefresh = String(error)?.includes('RefreshUrl');

  return (
    <>
      <span className="mr-auto text-error-normal">网络错误</span>
      <Button onClick={() => refreshRegisterOrder(domain)}>刷新</Button>
    </>
  );
};
