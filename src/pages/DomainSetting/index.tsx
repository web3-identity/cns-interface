import React from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '@components/Layout/PageWrapper';
import Button from '@components/Button';
import { useParamsDomainWithTransition } from '@hooks/useParamsDomain';
import useLasPath from '@hooks/useLasPath';
import { usePrefetchMydomainsPage } from '@service/prefetch';
import isMobile from '@utils/isMobie';
import DomainCard from './DomainCard';
import ChainsRegistrar from './ChainsRegistrar';

const DomainSetting: React.FC = () => {
  const { domain } = useParamsDomainWithTransition();
  const lastPath = useLasPath();
  const isBack = !!lastPath && !lastPath?.startsWith('/my-domains');

  const prefetchMyDomainsPage = usePrefetchMydomainsPage();

  return (
    <PageWrapper className="pt-4px">
      {!isMobile() && (
        <Link className="no-underline" to={isBack ? (-1 as unknown as string) : '/my-domains'} onMouseEnter={isBack ? undefined : prefetchMyDomainsPage}>
          <Button variant="text" color="white" className="!inline-flex mb-16px lt-md:mb-6px relative text-22px pl-36px pr-14px lt-md:text-18px lt-md:pl-28px lt-md:pr-12px">
            <span className="i-charm:chevron-left text-30px absolute left-0px lt-md:text-24px" />
            {isBack ? '返回' : '我的域名'}
          </Button>
        </Link>
      )}

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
