import React from 'react';
import PageWrapper from '@components/Layout/PageWrapper';
import AuthConnectButton from '@modules/AuthConnectButton';
import CurrentAccount from './CurrentAccount';
import DomainList from './DomainList';

const MyDomains: React.FC = () => {
  return (
    <PageWrapper className="pt-36px lt-md:pt-16px">
      <AuthConnectButton className="flex mx-auto mt-180px">
        <CurrentAccount />
        <DomainList />
      </AuthConnectButton>
    </PageWrapper>
  );
};

export default MyDomains;
