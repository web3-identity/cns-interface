import React, { type HTMLAttributes } from 'react';
import cx from 'clsx';

const PageWrapper: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cx('mx-auto max-w-976px lt-lg:px-24px lt-lg:max-w-100%', className)} {...props}>
      {children}
    </div>
  );
};

export default PageWrapper;
