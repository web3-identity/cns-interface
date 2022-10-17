import React from 'react';
import Popper, { type Props } from '@components/Popper';

const ToolTip: React.FC<Omit<Props, 'Content'> & { text?: string; }> = ({
  children,
  text,
  placement = 'top',
  animationType = 'zoom',
  arrow = true,
  delay = 180,
  interactiveDebounce = 100,
  trigger = 'mouseenter click',
  ...props
}) => {
  return (
    <Popper placement={placement} animationType={animationType} arrow={arrow} Content={text} delay={delay} trigger={trigger} interactiveDebounce={interactiveDebounce} {...props}>
      {children}
    </Popper>
  );
};

export default ToolTip;
