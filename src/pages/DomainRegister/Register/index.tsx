import React, { type HTMLAttributes } from 'react';
import cx from 'clsx';
import Step1 from './Step1';

export const RegisterContainer: React.FC<HTMLAttributes<HTMLDivElement> & { title: string; }> = ({ title, children, className, ...props }) => {
  return (
    <div className={cx("h-341px p-24px rounded-24px bg-purple-dark-active dropdown-shadow", className)} {...props}>
      <p className='text-22px leading-26px text-grey-normal'>{title}</p>
      <div className="mt-22px h-1px bg-purple-normal bg-opacity-30" />
      {children}
    </div>
  );
};

const Register: React.FC = () => {
  return <Step1 />;
};

export default Register;
