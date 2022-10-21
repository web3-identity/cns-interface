import React, { type HTMLAttributes, useEffect, useRef } from 'react';
import jazzIcon from '@utils/jazzIcon';
import { addressToNumber } from '@utils/addressUtils';
import removeAllChild from '@utils/removeAllChild';

const Avatar: React.FC<HTMLAttributes<HTMLDivElement> & { address: string | null | undefined; diameter: number }> = ({ address, diameter }) => {
  const renderAddress = addressToNumber(address);
  console.log(renderAddress);
  const avatarContainerRef = useRef(null)
  useEffect(() => {
    const avatarDom = jazzIcon(diameter, renderAddress)
    removeAllChild(avatarContainerRef.current)
    avatarContainerRef.current.appendChild(avatarDom)
  }, [avatarContainerRef, diameter, renderAddress])
  return <div ref={avatarContainerRef} />
};

export default Avatar;