import React, { Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import useClipboard from 'react-use-clipboard';
import BorderBox from '@components/Box/BorderBox';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import ToolTip from '@components/Tooltip';
import CfxAddress from '@modules/CfxAddress';
import Domain from '@modules/Domain';
import { useAccount } from '@service/account';
import { useAccountReverseRegistrar, useRefreshAccountReverseRegistrar, useHandleSetAccountReverseRegistrar } from '@service/accountReverseRegistrar';
import useIsLtMd from '@hooks/useIsLtMd';
import { ReactComponent as Logo } from '@assets/icons/logo.svg';
import { ReactComponent as CopyIcon } from '@assets/icons/copy.svg';

const CurrentAccount: React.FC = () => {
  const refreshAccountReverseRegistrar = useRefreshAccountReverseRegistrar();

  return (
    <BorderBox
      variant="gradient"
      className="relative mb-16px flex lt-md:flex-col justify-between md:items-center h-100px lt-md:h-fit px-24px lt-md:p-16px rounded-18px lt-md:rounded-12px"
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
  const { inTranscation, handleSetAccountReverseRegistrar: clearAccountReverseRegistrar } = useHandleSetAccountReverseRegistrar('');
  const [isCopied, copy] = useClipboard(accountReverseRegistrar || account, { successDuration: 1000 });

  return (
    <>
      <div className="text-22px lt-md:text-16px text-grey-normal font-bold">
        <div className="mb-12px lt-md:mb-2px text-grey-normal-hover text-opacity-50 text-14px lt-md:text-12px font-normal">当前账户</div>
        <div className="flex items-center lt-md:mt-4px">
          {!accountReverseRegistrar && (
            <>
              {account && <Avatar address={account} size={isLtMd ? 24 : 32} />}
              <CfxAddress address={account} className="ml-16px mr-10px lt-md:ml-4px lt-md:mr-4px" />
            </>
          )}
          {!!accountReverseRegistrar && (
            <>
              <Logo className="w-32px h-32px lt-md:w-24px lt-md:h-24px" />
              <Domain domain={accountReverseRegistrar} className="ml-16px mr-10px lt-md:ml-4px lt-md:mr-4px" />
            </>
          )}
          <ToolTip visible={isCopied} text="复制成功">
            <div
              className="inline-flex justify-center items-center w-24px h-24px lt-md:w-20px lt-md:h-20px bg-violet-normal-hover hover:bg-violet-normal rounded-4px lt-md:rounded-3px cursor-pointer transition-colors"
              onClick={copy}
            >
              <CopyIcon className="w-14px h-15px lt-md:w-12px lt-md:h-12.85px" />
            </div>
          </ToolTip>
        </div>
      </div>
      {accountReverseRegistrar && (
        <Button className="lt-md:w-full lt-md:mt-12px" onClick={clearAccountReverseRegistrar} loading={inTranscation}>
          取消展示
        </Button>
      )}
    </>
  );
};

const AccountLoading: React.FC = () => {
  return (
    <Delay mode='opacity' className='mx-auto my-29px'>
      <Spin className="text-36px" />
    </Delay>
  );
};

const ErrorBoundaryFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => (
  <div className="flex flex-col w-fit mx-auto my-15px">
    <p className="mb-16px text-center text-error-normal text-14px">网络错误</p>
    <Button size="small" onClick={resetErrorBoundary}>
      重试
    </Button>
  </div>
);
