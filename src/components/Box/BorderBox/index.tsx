import { type HTMLAttributes } from 'react';
import cx from 'clsx';
import './index.css';

const BorderBox: React.FC<HTMLAttributes<HTMLDivElement> & { withInput?: boolean; variant: 'linear' | 'purple' | 'transparent' | 'none' }> = ({
  children,
  className,
  variant = 'transparent',
  withInput,
  ...props
}) => {
  return (
    <div
      className={cx(
        'border-box',
        {
          'border-box--withInput': withInput,
          'border-box--none': variant === 'none',
          'border-box--transparent': variant === 'transparent',
          'border-box--purple': variant === 'purple',
          'border-box--linear': variant === 'linear',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default BorderBox;