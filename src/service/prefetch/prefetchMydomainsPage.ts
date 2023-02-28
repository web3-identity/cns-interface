import { useCallback } from 'react';
import { throttle } from 'lodash-es';
import { usePrefetchMyDomains } from '@service/myDomains';
import { usePrefetchAccountReverseRegistrar } from '@service/accountReverseRegistrar';

export const usePrefetchMydomainsPage = () => {
  const prefetchMyDomains = usePrefetchMyDomains();
  const prefetchAccountReverseRegistrar = usePrefetchAccountReverseRegistrar();
  return useCallback(
    throttle(() => {
      prefetchMyDomains();
      prefetchAccountReverseRegistrar();
    }, 10000),
    []
  );
};
