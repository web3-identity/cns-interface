import React, { type ComponentProps } from 'react';
import cx from 'clsx';

const PageWrapper: React.FC<ComponentProps<'div'>> = ({ className, children, ...props }) => {
  return (
    <div className={cx('flex-grow-1 flex-shrink-0 w-full mx-auto lg:max-w-976px lt-lg:px-24px lt-md:px-12px lt-tiny:px-6px', className)} {...props}>
      {children}
    </div>
  );
};

export default PageWrapper;
