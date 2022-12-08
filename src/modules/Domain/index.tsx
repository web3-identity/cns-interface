import React, { memo, useMemo, Suspense, type ComponentProps, type PropsWithChildren } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import Delay from '@components/Delay';
import ToolTip from '@components/Tooltip';
import { useDomainSensitiveCensor, useRefreshDomainSensitiveCensor } from '@service/domainInfo';

interface Props extends ComponentProps<'span'> {
  domain: string;
  ellipsisLength?: number;
  suffix?: boolean;
  useTooltip?: boolean;
}

const Domain: React.FC<Props> = ({ domain, ellipsisLength = 12, suffix = true, useTooltip = true, ...props }) => {
  const refreshDomainSensitiveCensor = useRefreshDomainSensitiveCensor(domain);

  const ellipsisDomain = useMemo(() => {
    if (!domain) return '';
    if (domain.length <= ellipsisLength) return domain;
    const half = Math.floor(ellipsisLength / 2);
    return `${domain.slice(0, half)}...${domain.slice(-half)}`;
  }, [domain, ellipsisLength]);

  return (
    <span {...props}>
      <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} />} onReset={refreshDomainSensitiveCensor}>
        <Suspense fallback={<Loading />}>
          <SensitiveCensor domain={domain}>
            <ToolTip text={`${domain}${suffix ? '.web3' : ''}`} disabled={!useTooltip || domain?.length <= ellipsisLength}>
              <span>{domain ? `${ellipsisDomain}${suffix ? '.web3' : ''}` : null}</span>
            </ToolTip>
          </SensitiveCensor>
        </Suspense>
      </ErrorBoundary>
    </span>
  );
};

const SensitiveCensor = ({ domain, children }: PropsWithChildren<{ domain: string }>) => {
  const illegalSensitiveCensor = useDomainSensitiveCensor(domain);
  return (
    <>
      {illegalSensitiveCensor && (
        <>
          ****.web3 <span className="text-error-normal">({illegalSensitiveCensor})</span>
        </>
      )}
      {!illegalSensitiveCensor && children}
    </>
  );
};

const Loading: React.FC = () => (
  <Delay delay={300} mode="opacity">
    敏感词检测...
  </Delay>
);
const ErrorBoundaryFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => (
  <div className="text-error-normal cursor-pointer select-none group" onClick={resetErrorBoundary}>
    <span>敏感词检测失败，</span>
    <span className="underline group-hover:underline-none">点此重试</span>
  </div>
);

export default memo(Domain);
