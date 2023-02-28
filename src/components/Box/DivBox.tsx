import React, { type ComponentProps } from 'react';

const DivBox: React.FC<ComponentProps<'div'>> = ({ children, ...props }) => <div {...props}>{children}</div>;

export default DivBox;