import React, { memo, type ComponentProps } from 'react';
import ToolTip from '@components/Tooltip';
import { shortenAddress } from '@utils/addressUtils';
import isMobile from '@utils/isMobie';

interface Props extends ComponentProps<'span'> {
  address: string;
  ellipsis?: boolean;
  useTooltip?: boolean;
}

const CfxAddress: React.FC<Props> = ({ address, ellipsis = true, useTooltip = !isMobile, ...props }) => {
  if (!useTooltip) return <span {...props}>{ellipsis ? shortenAddress(address) : address}</span>;
  return (
    <ToolTip text={address} delay={[444, 0]} interactive>
      <span {...props}>{ellipsis ? shortenAddress(address) : address}</span>
    </ToolTip>
  );
};

export default memo(CfxAddress);
