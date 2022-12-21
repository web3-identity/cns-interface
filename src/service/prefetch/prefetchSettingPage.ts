import { useCallback } from 'react';
import { throttle } from 'lodash-es';
import { usePrefetchDomainOwner, usePrefetchDomainExpire, usePrefetchDomainSensitiveCensor } from '@service/domainInfo';
import { getDomainRegistrar as prefetchDomainRegistrar } from '@service/domainRegistrar';
import { usePrefetchAccountReverseRegistrar } from '@service/accountReverseRegistrar';

export const usePrefetchSettingPage = (domain: string) => {
  const prefetchDomainOwner = usePrefetchDomainOwner();
  const prefetchDomainExpire = usePrefetchDomainExpire();
  const prefetchDomainSensitiveCensor = usePrefetchDomainSensitiveCensor();
  const prefetchAccountReverseRegistrar = usePrefetchAccountReverseRegistrar();
  
  return useCallback(
    throttle(() => {
      prefetchDomainOwner(domain);
      prefetchDomainRegistrar(domain);
      prefetchDomainExpire(domain);
      prefetchDomainSensitiveCensor(domain);
      prefetchAccountReverseRegistrar();
    }, 10000),
    [domain]
  );
};
