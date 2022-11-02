import React, { memo, useMemo, type ComponentProps } from 'react';
import ToolTip from '@components/Tooltip';

interface Props extends ComponentProps<'span'> {
  domain: string;
  ellipsisLength?: number;
}

const Domain: React.FC<Props> = ({ domain, ellipsisLength = 12, ...props }) => {
  const ellipsisDomain = useMemo(() => {
    if (!domain) return '';
    if (domain.length <= ellipsisLength) return domain;
    const half = Math.floor(ellipsisLength / 2);
    return `${domain.slice(0, half)}...${domain.slice(-half)}`;
  }, [domain, ellipsisLength]);

  return (
    <ToolTip text={`${domain}.web3`} disabled={domain?.length <= ellipsisLength}>
      <span {...props}>{domain ? `${ellipsisDomain}.web3` : null}</span>
    </ToolTip>
  );
};

export default memo(Domain);
