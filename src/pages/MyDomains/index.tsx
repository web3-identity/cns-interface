import React, { Suspense, useTransition } from 'react';
import PageWrapper from '@components/Layout/PageWrapper';
import { useMyDomains } from '@service/myDomains';

const MyDomains: React.FC = () => {
  const myDomains = useMyDomains();


  return (
    <PageWrapper className="pt-72px">
      <Suspense fallback={null}>{myDomains}</Suspense>
    </PageWrapper>
  );
};

export default MyDomains;
