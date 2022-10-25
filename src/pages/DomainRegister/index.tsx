import React from 'react';
import PageWrapper from '@components/Layout/PageWrapper';
import { useParams } from 'react-router-dom';
import Delay from '@components/Delay';
import Status from '@modules/Status';
import Register from './Register';
import ProgressBar from './ProgressBar';

const DomainRegister: React.FC = () => {
  const { domain: _domain } = useParams();
  const domain = _domain?.toLocaleLowerCase().trim() ?? '';

  return (
    <PageWrapper className="pt-72px">
      <Status className="mb-24px" domain={domain} where="register" />
      <Register domain={domain} />
      <ProgressBar domain={domain} />
    </PageWrapper>
  );
};

export default DomainRegister;
