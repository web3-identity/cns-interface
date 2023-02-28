import { useState, useEffect, useTransition } from 'react';
import { useParams } from 'react-router-dom';

export const useParamsDomain = () => {
  const { domain: _domain } = useParams();
  return _domain?.toLocaleLowerCase().trim() ?? '';
};


export const useParamsDomainWithTransition = () => {
  const { domain: _domain } = useParams();
  const [domain, setDomain] = useState<string>(() => _domain ?? '');

  const [isPending, startTransition] = useTransition();
  useEffect(() => startTransition(() => setDomain(_domain?.toLocaleLowerCase().trim() ?? '')), [_domain]);
  return {
    domain,
    isPending,
  } as const;
}