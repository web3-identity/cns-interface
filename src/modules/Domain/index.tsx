import React, { memo, useMemo, type ComponentProps } from 'react';
import ToolTip from '@components/Tooltip';
// import { useDomainSensitiveCensor, useRefreshDomainSensitiveCensor } from '@service/domainInfo';

interface Props extends ComponentProps<'span'> {
  domain: string;
  ellipsisLength?: number;
  suffix?: boolean;
  useTooltip?: boolean;
}

const Domain: React.FC<Props> = ({ domain, ellipsisLength = 12, suffix = true, useTooltip = true, ...props }) => {
  const ellipsisDomain = useMemo(() => {
    if (!domain) return '';
    if (domain.length <= ellipsisLength) return domain;
    const half = Math.floor(ellipsisLength / 2);
    return `${domain.slice(0, half)}...${domain.slice(-half)}`;
  }, [domain, ellipsisLength]);

  if (!useTooltip) return <span {...props}>{domain ? `${ellipsisDomain}${suffix ? '.web3' : ''}` : null}</span>;
  return (
    <ToolTip text={`${domain}${suffix ? '.web3' : ''}`} disabled={domain?.length <= ellipsisLength}>
      <span {...props}>{domain ? `${ellipsisDomain}${suffix ? '.web3' : ''}` : null}</span>
    </ToolTip>
  );
};

// const SensitiveCensor: React.FC<{ domain: string; }> = ({ domain, children }) => {
//   const illegalSensitiveCensor = useDomainSensitiveCensor(domain);

//   if (illegalSensitiveCensor) return `****.web3 (${illegalSensitiveCensor})`
//   return children;
// }

export default memo(Domain);
