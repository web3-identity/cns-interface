import React, { memo, useRef, useLayoutEffect, type ComponentProps } from 'react';
import jazzIcon from '@utils/jazzIcon';
import { addressToNumber, convertCfxToHex } from '@utils/addressUtils';
import removeAllChild from '@utils/removeAllChild';

const Avatar: React.FC<ComponentProps<'div'> & { address: string; size: number }> = ({ address, size, ...props }) => {
  const avatarContainerRef = useRef<HTMLDivElement>(null!);

  useLayoutEffect(() => {
    removeAllChild(avatarContainerRef.current);
    if (!address) return;
    const renderAddress = addressToNumber(convertCfxToHex(address));
    const avatarDom = jazzIcon(size, renderAddress);
    avatarContainerRef.current.appendChild(avatarDom);
  }, [size, address]);

  return <div {...props} style={{ width: size, height: size, ...props.style }} ref={avatarContainerRef} />;
};

export default memo(Avatar);
