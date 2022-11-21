import React from 'react';
import { NavLink } from 'react-router-dom';
import PageWrapper from '@components/Layout/PageWrapper';
import Button from '@components/Button';
import { useParamsDomainWithTransition } from '@hooks/useParamsDomain';
import useLasPath from '@hooks/useLasPath';
import { usePrefetchMydomainsPage } from '@service/prefetch';
import DomainCard from './DomainCard';
import ChainsRegistrar from './ChainsRegistrar';

const DomainSetting: React.FC = () => {
  const { domain } = useParamsDomainWithTransition();
  const lastPath = useLasPath();
  const isBack = !!lastPath && !lastPath?.startsWith('/my-domains');

  const prefetchMyDomainsPage = usePrefetchMydomainsPage();

  return (
    <PageWrapper className="pt-36px lt-md:pt-16px">
      <NavLink className="no-underline lt-md:display-none" to={isBack ? (-1 as unknown as string) : '/my-domains'} onMouseEnter={isBack ? undefined : prefetchMyDomainsPage}>
        <Button variant="text" color="white" className="!inline-flex mb-16px relative text-22px pl-36px pr-14px">
          <span className="i-charm:chevron-left text-30px absolute left-0px" />
          {isBack ? '返回' : '我的域名'}
        </Button>
      </NavLink>

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
