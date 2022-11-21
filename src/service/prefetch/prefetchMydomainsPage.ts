import { useCallback } from 'react';
import { throttle } from 'lodash-es';
import { usePrefetchMyDomains } from '@service/myDomains';
import { usePrefetchDomainReverseRegistrar } from '@service/domainReverseRegistrar';

export const usePrefetchMydomainsPage = () => {
  const prefetchMyDomains = usePrefetchMyDomains();
  const prefetchDomainReverseRegistrar = usePrefetchDomainReverseRegistrar();
  return useCallback(
    throttle(() => {
      prefetchMyDomains();
      prefetchDomainReverseRegistrar();
    }, 10000),
    []
  );
};
