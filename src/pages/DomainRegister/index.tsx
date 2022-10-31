import React, { type HTMLAttributes } from 'react';
import cx from 'clsx';
import PageWrapper from '@components/Layout/PageWrapper';
import { useParams } from 'react-router-dom';
import BorderBox from '@components/Box/BorderBox';
import Register from './Register';
import ProgressBar from './ProgressBar';

export const RegisterBox: React.FC<HTMLAttributes<HTMLDivElement> & { title: string }> = ({ title, children, className, ...props }) => {
  return (
    <div className={cx('h-341px p-24px rounded-24px bg-purple-dark-active dropdown-shadow whitespace-nowrap', className)} {...props}>
      <p className="text-22px leading-26px text-grey-normal">{title}</p>
      <div className="mt-22px h-1px bg-purple-normal bg-opacity-30" />
      {children}
    </div>
  );
};


const DomainRegister: React.FC = () => {
  const { domain: _domain } = useParams();
  const domain = _domain?.toLocaleLowerCase().trim() ?? '';

  return (
    <PageWrapper className="pt-72px">
      <BorderBox variant='gradient' className='mb-40px w-fit min-w-200px h-60px leading-58px rounded-24px text-center text-green-normal text-22px font-bold'>
        {domain}
      </BorderBox>
      <Register domain={domain} />
      <ProgressBar domain={domain} />
    </PageWrapper>
  );
};

export default DomainRegister;
