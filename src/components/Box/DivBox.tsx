import React, { type HTMLAttributes } from 'react';

const DivBox: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => <div {...props}>{children}</div>;

export default DivBox;