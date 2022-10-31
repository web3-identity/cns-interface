import React, { Suspense } from 'react';
import PageWrapper from '@components/Layout/PageWrapper';
import { useMyDomains } from '@service/myDomains';

const DomainList: React.FC = () => {
  const myDomains = useMyDomains();

  return <>{myDomains}</>;
};

const MyDomains: React.FC = () => {
  return (
    <PageWrapper className="pt-72px">
      <Suspense fallback={null}>
        <DomainList />
      </Suspense>
    </PageWrapper>
  );
};

export default MyDomains;
