import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@components/Layout/PageWrapper';
import Button from '@components/Button';
import { useParamsDomainWithTransition } from '@hooks/useParamsDomain';
import DomainCard from './DomainCard';
import ChainsRegistrar from './ChainsRegistrar';

const DomainSetting: React.FC = () => {
  const { domain } = useParamsDomainWithTransition();
  const navigate = useNavigate();
  const isBack = history?.length > 2;

  return (
    <PageWrapper className="pt-36px">
      <Button variant="text" color="white" className="!inline-flex mb-16px relative text-22px pl-36px pr-14px" onClick={() => navigate(isBack ? '-1' : '/my-domains')}>
        <span className="i-charm:chevron-left text-30px absolute left-0px" />
        {isBack ? '返回' : '我的域名'}
      </Button>

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
