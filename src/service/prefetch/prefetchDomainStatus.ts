import { useCallback, useEffect } from 'react';
import { debounce } from 'lodash-es';
import { usePrefetchDomainStatus } from '@service/domainInfo';

export const useDoPrefetchDomainStatusModule = (domain: string) => {
  const prefetchDomainStatus = usePrefetchDomainStatus();
  const prefetch = useCallback(
    debounce((domain: string) => {
      if (!domain) return;
      prefetchDomainStatus(domain);
    }, 400),
    []
  );

  useEffect(() => {
    prefetch(domain);
  }, [domain]);
};
