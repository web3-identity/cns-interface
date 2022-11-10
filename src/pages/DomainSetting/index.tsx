import React from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '@components/Layout/PageWrapper';
import Button from '@components/Button';
import { useParamsDomainWithTransition } from '@hooks/useParamsDomain';
import DomainCard from './DomainCard';
import ChainsRegistrar from './ChainsRegistrar';

const DomainSetting: React.FC = () => {
  const { domain } = useParamsDomainWithTransition();

  return (
    <PageWrapper className="pt-80px">
      <Link to="/my-domains" className="no-underline mb-16px">
        <Button variant="text" color="white" className="relative text-22px pl-36px pr-14px">
          <span className="i-charm:chevron-left text-30px absolute left-0px" />
          域名管理
        </Button>
      </Link>

      {domain && (
        <>
          <DomainCard domain={domain} />
          <ChainsRegistrar domain={domain} />
        </>
      )}
    </PageWrapper>
  );
};

export default DomainSetting;
