import React, { type ComponentProps } from 'react';
import cx from 'clsx';
import PageWrapper from '@components/Layout/PageWrapper';
import BorderBox from '@components/Box/BorderBox';
import Domain from '@modules/Domain';
import { useParamsDomainWithTransition } from '@hooks/useParamsDomain';
import Register from './Register';
import ProgressBar from './ProgressBar';
import StatusCheck from './StatusCheck';

export const RegisterBox: React.FC<ComponentProps<'div'> & { title?: string }> = ({ title, children, className, ...props }) => {
  return (
    <div
      className={cx('md:h-340px p-24px rounded-24px bg-purple-dark-active dropdown-shadow whitespace-nowrap lt-md:min-h-392px lt-md:p-16px rounded-12px', className)}
      {...props}
    >
      {title && (
        <>
          <p className="text-22px leading-26px text-grey-normal font-bold lt-md:text-16px lt-md:leading-18px">{title}</p>
          <div className="mt-22px h-1px bg-purple-normal bg-opacity-30 lt-md:mt-16px" />
        </>
      )}

      {children}
    </div>
  );
};

const DomainRegister: React.FC = () => {
  const { domain, isPending } = useParamsDomainWithTransition();

  return (
    <PageWrapper className="relative pt-72px lt-md:pt-20px">
      <BorderBox
        variant="gradient"
        className="mb-24px w-fit h-58px leading-58px px-20px rounded-16px text-center text-green-normal text-22px font-bold lt-md:mb-16px lt-md:w-full lt-md:h-56px lt-md:leading-56px lt-md:px-16px lt-md:rounded-12px lt-md:text-20px lt-md:text-left"
      >
        <Domain domain={domain} />
      </BorderBox>
      <StatusCheck domain={domain} isPending={isPending}>
        <Register domain={domain} />
        <ProgressBar domain={domain} />
      </StatusCheck>
    </PageWrapper>
  );
};

export default DomainRegister;
