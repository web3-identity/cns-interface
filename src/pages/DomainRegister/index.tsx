import React from 'react';
import PageWrapper from '@components/Layout/PageWrapper';
import { useParams } from 'react-router-dom';
import Status from '@modules/Status';

const DomainRegister: React.FC = () => {
  const { domain: _domain } = useParams();
  const domain = _domain?.toLocaleLowerCase().trim() ?? '';

  return (
    <PageWrapper className="pt-72px">
      <Status domain={domain} where="register" />
    </PageWrapper>
  );
};

export default DomainRegister;
