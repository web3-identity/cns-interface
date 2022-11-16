import React, { Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import BorderBox from '@components/Box/BorderBox';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import { useAccount } from '@service/account';
import { useDomainReverseRegistrar, useRefreshDomainReverseRegistrar } from '@service/domainReverseRegistrar';
import { useMyDomains } from '@service/myDomains';
import { shortenAddress } from '@utils/addressUtils';
import isMobile from '@utils/isMobie';
import showSetReverseRegistrarModal from './SetReverseRegistrarModal';

const CurrentAccount: React.FC = () => {
  const refreshDomainReverseRegistrar = useRefreshDomainReverseRegistrar();

  return (
    <BorderBox variant="gradient" className="mb-16px flex justify-between h-100px px-24px rounded-18px lt-md:p-16px lt-md:flex-col lt-md:h-auto">
      <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} />} onReset={refreshDomainReverseRegistrar}>
        <Suspense fallback={<AccountLoading />}>
          <AccountContent />
        </Suspense>
      </ErrorBoundary>
    </BorderBox>
  );
};

export default CurrentAccount;


const AccountContent: React.FC<{}> = ({}) => {
  const account = useAccount()!;
  const myDomains = useMyDomains();
  const domainReverseRegistrar = useDomainReverseRegistrar();

  return (
    <>
      <div className="flex flex-col justify-between pt-14px pb-22px text-22px font-bold text-grey-normal lt-md:py-0px lt-md:text-16px lt-md:leading-18px">
        <span className="text-grey-normal-hover text-opacity-50 text-14px leading-18px lt-md:text-12px lt-md:leading-14px">当前账户</span>
        {!domainReverseRegistrar ? (
          <div className="flex gap-16px items-center lt-md:gap-4px lt-md:mt-2px">
            {account && <Avatar address={account} size={30} />}
            <span>{shortenAddress(account)}</span>
          </div>
        ) : (
          <span className="lt-md:inline-block lt-md:mt-4px">{domainReverseRegistrar}</span>
        )}
      </div>
      <div className="flex items-center lt-md:mt-16px">
        <Button fullWidth={isMobile()} onClick={() => showSetReverseRegistrarModal({ account, myDomains, domainReverseRegistrar })} disabled={!myDomains?.length}>设置.web3域名</Button>
      </div>
    </>
  );
};

const AccountLoading: React.FC = () => (
  <Delay>
    <Spin className="text-36px self-center mx-auto" />
  </Delay>
);

const ErrorBoundaryFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => (
  <div className='inline-block self-center mx-auto'>
    <p className='mb-6px text-center text-error-normal text-14px'>网络错误</p>
    <Button size="small" onClick={resetErrorBoundary}>
      重试
    </Button>
  </div>
);