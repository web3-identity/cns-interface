import { useCallback } from 'react';
import { throttle } from 'lodash-es';
import { usePrefetchDomainOwner, usePrefetchDomainExpire, usePrefetchDomainSensitiveCensor } from '@service/domainInfo';
import { getDomainRegistrar as prefetchDomainRegistrar } from '@service/domainRegistrar';

export const usePrefetchSettingPage = (domain: string) => {
  const prefetchDomainOwner = usePrefetchDomainOwner();
  const prefetchDomainExpire = usePrefetchDomainExpire();
  const prefetchDomainSensitiveCensor = usePrefetchDomainSensitiveCensor();
  return useCallback(
    throttle(() => {
      prefetchDomainOwner(domain);
      prefetchDomainRegistrar(domain);
      prefetchDomainExpire(domain);
      prefetchDomainSensitiveCensor(domain);
    }, 10000),
    [domain]
  );
};
