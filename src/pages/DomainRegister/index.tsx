import React, { type HTMLAttributes } from 'react';
import cx from 'clsx';
import { useParams } from 'react-router-dom';
import PageWrapper from '@components/Layout/PageWrapper';
import BorderBox from '@components/Box/BorderBox';
import Domain from '@modules/Domain';
import Register from './Register';
import ProgressBar from './ProgressBar';
import StatusCheck from './StatusCheck';

export const RegisterBox: React.FC<HTMLAttributes<HTMLDivElement> & { title?: string }> = ({ title, children, className, ...props }) => {
  return (
    <div className={cx('h-341px p-24px rounded-24px bg-purple-dark-active dropdown-shadow whitespace-nowrap', className)} {...props}>
      {title && (
        <>
          <p className="text-22px leading-26px text-grey-normal">{title}</p>
          <div className="mt-22px h-1px bg-purple-normal bg-opacity-30" />
        </>
      )}

      {children}
    </div>
  );
};

const DomainRegister: React.FC = () => {
  const { domain: _domain } = useParams();
  const domain = _domain?.toLocaleLowerCase().trim() ?? '';

  return (
    <PageWrapper className="pt-72px">
      <BorderBox variant="gradient" className="mb-40px w-fit px-24px min-w-200px h-60px leading-58px rounded-24px text-center text-green-normal text-22px font-bold">
        <Domain domain={domain} />
      </BorderBox>
      <StatusCheck domain={domain}>
        <Register domain={domain} />
        <ProgressBar domain={domain} />
      </StatusCheck>
    </PageWrapper>
  );
};

export default DomainRegister;
