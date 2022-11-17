import { memo, useRef, useLayoutEffect, forwardRef, type ComponentProps } from 'react';
import jazzIcon from '@utils/jazzIcon';
import { addressToNumber, convertCfxToHex } from '@utils/addressUtils';
import removeAllChild from '@utils/removeAllChild';
import composeRef from '@utils/composeRef';
import './index.css';

const Avatar = forwardRef<HTMLDivElement, ComponentProps<'div'> & { address: string; size: number }>(({ address, size, ...props }, ref) => {
  const avatarContainerRef = useRef<HTMLDivElement>(null!);

  useLayoutEffect(() => {
    removeAllChild(avatarContainerRef.current);
    if (!address) return;
    const renderAddress = addressToNumber(convertCfxToHex(address));
    const avatarDom = jazzIcon(size, renderAddress);
    avatarContainerRef.current.appendChild(avatarDom);
  }, [size, address]);

  return <div className="avatar" {...props} style={{ width: size, height: size, ...props.style }} ref={composeRef(avatarContainerRef, ref)} />;
});

export default memo(Avatar);
