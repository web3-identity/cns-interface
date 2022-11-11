import React, { memo, useMemo, type ComponentProps } from 'react';
import ToolTip from '@components/Tooltip';

interface Props extends ComponentProps<'span'> {
  domain: string;
  ellipsisLength?: number;
  suffix?: boolean;
  useTooltip?: boolean;
}

const Domain: React.FC<Props> = ({ domain, ellipsisLength = 12, suffix = false, useTooltip = true, ...props }) => {
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

export default memo(Domain);
