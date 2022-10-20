import { memo, type HTMLAttributes } from 'react';
import cx from 'clsx';
import './index.css';

const LinearBorderBox: React.FC<HTMLAttributes<HTMLDivElement> & { withInput?: boolean }> = ({ children, className, withInput, ...props }) => {
  return (
    <div className={cx('linearBorderBox', { 'linearBorderBox--withInput': withInput }, className)} {...props}>
      {children}
    </div>
  );
};

export default memo(LinearBorderBox);
