import React, { Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import BorderBox from '@components/Box/BorderBox';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import CfxAddress from '@modules/CfxAddress';
import Domain from '@modules/Domain';
import { useAccount } from '@service/account';
import { useAccountReverseRegistrar, useRefreshAccountReverseRegistrar } from '@service/accountReverseRegistrar';
import useIsLtMd from '@hooks/useIsLtMd';

const CurrentAccount: React.FC = () => {
  const refreshAccountReverseRegistrar = useRefreshAccountReverseRegistrar();

  return (
    <BorderBox
      variant="gradient"
      className="relative mb-16px flex lt-md:flex-col justify-between md:items-center h-100px lt-md:h-126px px-24px lt-md:p-16px rounded-18px lt-md:rounded-12px"
    >
      <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} />} onReset={refreshAccountReverseRegistrar}>
        <Suspense fallback={<AccountLoading />}>
          <AccountContent />
        </Suspense>
      </ErrorBoundary>
    </BorderBox>
  );
};

export default CurrentAccount;

const AccountContent: React.FC<{}> = ({}) => {
  const isLtMd = useIsLtMd();
  const account = useAccount()!;
  const accountReverseRegistrar = useAccountReverseRegistrar();

  return (
    <>
      <div className="text-22px lt-md:text-16px text-grey-normal font-bold">
        <div className="mb-12px lt-md:mb-2px text-grey-normal-hover text-opacity-50 text-14px lt-md:text-12px font-normal">当前账户</div>
        {!accountReverseRegistrar ? (
          <div className="flex items-center gap-16px lt-md:gap-4px lt-md:mt-2px">
            {account && <Avatar address={account} size={isLtMd ? 24 : 32} />}
            <CfxAddress address={account} />
          </div>
        ) : (
          <Domain className="block lt-md:inline-block lt-md:mt-4px" domain={accountReverseRegistrar} />
        )}
      </div>
    </>
  );
};

const AccountLoading: React.FC = () => {
  return (
    <Delay>
      <Spin className="!absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-36px" />
    </Delay>
  );
};

const ErrorBoundaryFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => (
  <div className="inline-block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
    <p className="mb-6px text-center text-error-normal text-14px">网络错误</p>
    <Button size="small" onClick={resetErrorBoundary}>
      重试
    </Button>
  </div>
);
