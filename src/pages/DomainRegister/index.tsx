import React, { useEffect, useState, useTransition, memo, type HTMLAttributes } from 'react';
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
    <div className={cx('h-340px p-24px rounded-24px bg-purple-dark-active dropdown-shadow whitespace-nowrap lt-md:px-16px lt-md:h-392px rounded-8px', className)} {...props}>
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
  const { domain: _domain } = useParams();
  const [domain, setDomain] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  useEffect(() => startTransition(() => setDomain(_domain?.toLocaleLowerCase().trim() ?? '')), [_domain]);

  return (
    <PageWrapper className="relative pt-72px">
      <BorderBox variant="gradient" className="mb-40px w-fit px-24px py-14px leading-26px rounded-16px text-center text-green-normal text-22px font-bold lt-md:w-full lt-md:rounded-12px lt-md:text-20px lt-md:text-left lt-md:leading-24px lt-md:mb-16px">
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
