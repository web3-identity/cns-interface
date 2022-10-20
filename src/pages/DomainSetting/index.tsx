import React from 'react';
import PageWrapper from '@components/Layout/PageWrapper';
import { useParams } from 'react-router-dom';

const DomainSetting: React.FC = () => {
  const { domain } = useParams();

  return <PageWrapper className="pt-72px">DomainSetting</PageWrapper>;
};

export default DomainSetting;
