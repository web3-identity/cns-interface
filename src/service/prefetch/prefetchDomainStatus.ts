import { useRef, useCallback, useEffect } from 'react';
import { debounce } from 'lodash-es';
import { usePrefetchDomainStatus, usePrefetchDomainOwner, usePrefetchDomainSensitiveCensor } from '@service/domainInfo';

export const useDoPrefetchDomainStatusModule = (domain: string) => {
  const pre = useRef<string>(domain);
  
  const prefetchDomainStatus = usePrefetchDomainStatus();
  const prefetchDomainOwner = usePrefetchDomainOwner();
  const prefetchDomainSensitiveCensor = usePrefetchDomainSensitiveCensor();
  const prefetch = useCallback(
    debounce((domain: string) => {
      if (!domain) return;
      prefetchDomainStatus(domain);
      prefetchDomainOwner(domain);
      prefetchDomainSensitiveCensor(domain);
    }, 300),
    []
  );

  useEffect(() => {
    if (!domain) return;
    if (Math.abs((pre.current?.length ?? 0) - (domain?.length ?? 0)) > 1) {
      prefetchDomainStatus(domain);
      prefetchDomainOwner(domain);
      prefetchDomainSensitiveCensor(domain);
    } else {
      prefetch(domain);
    }
    pre.current = domain;
  }, [domain]);
};
