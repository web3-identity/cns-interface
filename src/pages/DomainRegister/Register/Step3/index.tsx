import React, { Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Link } from 'react-router-dom';
import Domain from '@modules/Domain';
import Button from '@components/Button';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import { ReactComponent as SuccessIcon } from '@assets/icons/Success.svg';
import { useDomainExpire, useRefreshDomainExpire } from '@service/domainInfo';
import { usePrefetchSettingPage } from '@service/prefetch';
import { RegisterBox } from '@pages/DomainRegister';

const Step3: React.FC<{ domain: string }> = ({ domain }) => {
  const refreshDomainExpire = useRefreshDomainExpire(domain);
  const prefetchSettingPage = usePrefetchSettingPage(domain);

  return (
    <RegisterBox title="注册完成" className="flex flex-col text-14px text-grey-normal-hover text-opacity-50 lt-md:text-12px lt-md:leading-14px">
      <div className="mt-54px lt-md:mt-20px flex flex-row-reverse justify-center gap-72px lt-md:flex-col lt-md:gap-28px">
        <div>
          <p className="flex items-baseline h-32px lt-md:h-16px">
            注册用户名
            <Domain className="ml-24px text-28px text-grey-normal font-bold lt-md:text-16px lt-md:ml-8px md:translate-y-1px" domain={domain} />
          </p>

          <div className="mt-20px flex items-baseline h-32px lt-md:h-16px">
            <ErrorBoundary fallbackRender={(fallbackProps) => <ErrorBoundaryFallback {...fallbackProps} />} onReset={refreshDomainExpire}>
              有效期至
              <div className="relative inline-flex items-baseline gap-3px ml-24px text-28px text-grey-normal font-bold lt-md:text-16px lt-md:ml-8px md:translate-y-1px">
                <Suspense fallback={<ExpireTimeLoading />}>
                  <ExpireTime domain={domain} />
                </Suspense>
              </div>
            </ErrorBoundary>
          </div>
        </div>

        <div className="text-right text-grey-normal lt-md:self-center">
          <SuccessIcon className="mb-16px w-80px h-80px" />
          <p className="text-14px">注册成功！</p>
        </div>
      </div>

      <Link to={`/setting/${domain}`} className="mx-auto no-underline md:-translate-x-13px lt-md:mt-auto lt-md:w-full" onMouseEnter={prefetchSettingPage}>
        <Button className="w-152px lt-md:w-full">管理用户名</Button>
      </Link>
    </RegisterBox>
  );
};

export default Step3;

const ExpireTimeLoading: React.FC = () => (
  <Delay mode="opacity">
    <span className="opacity-0">...</span>
    <Spin className="!absolute left-0 top-1/2 -translate-y-1/2 text-1em lt-md:text-1.4em" />
  </Delay>
);

const ExpireTime: React.FC<{ domain: string }> = ({ domain }) => {
  const { date } = useDomainExpire(domain) ?? {};

  return (
    <>
      <span>{date.year}</span>
      <span className="-translate-y-1px text-14px text-grey-normal-hover text-opacity-50">年</span>
      <span>{date.month}</span>
      <span className="-translate-y-1px text-14px text-grey-normal-hover text-opacity-50">月</span>
      <span>{date.day}</span>
      <span className="-translate-y-1px text-14px text-grey-normal-hover text-opacity-50">日</span>
      {import.meta.env.VITE_RegisterUnit === '小时' && (
        <>
          <span>{date.hour}</span>
          <span className="-translate-y-1px text-14px text-grey-normal-hover text-opacity-50">时</span>
        </>
      )}
    </>
  );
};

const ErrorBoundaryFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => {
  return (
    <span className="text-14px text-error-normal cursor-pointer select-none group" onClick={resetErrorBoundary}>
      获取有效期失败，<span className="underline group-hover:underline-none">点此重试</span>
      <span className="opacity-0 relative inline-flex items-baseline gap-3px ml-24px text-28px text-grey-normal font-bold lt-md:text-16px lt-md:ml-8px md:translate-y-1px">
        ...
      </span>
    </span>
  );
};
