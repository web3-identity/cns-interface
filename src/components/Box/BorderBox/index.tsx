import { type ComponentProps } from 'react';
import cx from 'clsx';
import './index.css';

const BorderBox: React.FC<ComponentProps<'div'> & { withInput?: boolean; variant: 'gradient' | 'purple' | 'transparent' | 'none' }> = ({
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
          'border-box--gradient': variant === 'gradient',
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
