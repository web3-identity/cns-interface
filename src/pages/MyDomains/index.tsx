import React, { Suspense, useTransition } from 'react';
import PageWrapper from '@components/Layout/PageWrapper';
import { useAccount } from '@service/account';
import { useMyDomains } from '@service/myDomains';

const MyDomains: React.FC = () => {
  const account = useAccount();
  const myDomains = useMyDomains(account!);
  const [isPending, startTransition] = useTransition();

  return (
    <PageWrapper className="pt-72px">
      <Suspense fallback={null}>{myDomains}</Suspense>
    </PageWrapper>
  );
};

export default MyDomains;
