import React from 'react';
import PageWrapper from '@components/Layout/PageWrapper';
import AuthConnectButton from '@modules/AuthConnectButton';
import CurrentAccount from './CurrentAccount';
import DomainList from './DomainList';

const MyDomains: React.FC = () => {
  return (
    <PageWrapper className="pt-40px lt-md:pt-4px">
      <AuthConnectButton className="flex mx-auto mt-180px">
        <CurrentAccount />
        <DomainList />
      </AuthConnectButton>
    </PageWrapper>
  );
};

export default MyDomains;
