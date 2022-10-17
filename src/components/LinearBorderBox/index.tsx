import { memo, type PropsWithChildren, type HTMLAttributes } from 'react';
import cx from 'clsx';
import './index.css';

const LinearBorderBox = ({ children, className, withInput, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { withInput?: boolean; }>) => {
  return (
    <div className={cx('linearBorderBox', { 'linearBorderBox--withInput': withInput }, className)} {...props}>
      {children}
    </div>
  );
};

export default memo(LinearBorderBox);
