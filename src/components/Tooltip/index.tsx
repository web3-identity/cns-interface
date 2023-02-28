import React from 'react';
import Popper, { type Props } from '@components/Popper';

const ToolTip: React.FC<Omit<Props, 'Content'> & { text?: string }> = ({
  children,
  text,
  placement = 'top',
  animationType = 'fade',
  arrow = true,
  delay = 180,
  trigger = 'mouseenter',
  visible,
  interactive = true,
  ...props
}) => {
  return (
    <Popper
      visible={visible}
      placement={placement}
      animationType={animationType}
      arrow={arrow}
      Content={text}
      delay={delay}
      trigger={typeof visible === 'boolean' ? undefined : trigger}
      interactive={interactive}
      {...props}
    >
      {children}
    </Popper>
  );
};

export default ToolTip;
