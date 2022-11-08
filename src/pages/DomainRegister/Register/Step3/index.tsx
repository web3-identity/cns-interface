import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import isMobile from '@utils/isMobie';
import Domain from '@modules/Domain';
import Button from '@components/Button';
import { ReactComponent as SuccessIcon } from '@assets/icons/Success.svg';
import { useDomainExpire } from '@service/domainInfo';
import { RegisterBox } from '@pages/DomainRegister';

const ExpireTime: React.FC<{ domain: string }> = ({ domain }) => {
  const { date } = useDomainExpire(domain) ?? {};

  return (
    <span className="inline-flex items-baseline gap-3px ml-32px text-28px text-grey-normal font-bold lt-md:text-16px lt-md:leading-18px lt-md:ml-8px">
      <span>{date.year}</span>
      <span className="-translate-y-1px text-14px text-grey-normal-hover text-opacity-50">年</span>
      <span>{date.month}</span>
      <span className="-translate-y-1px text-14px text-grey-normal-hover text-opacity-50">月</span>
      <span>{date.day}</span>
      <span className="-translate-y-1px text-14px text-grey-normal-hover text-opacity-50">日</span>
    </span>
  );
};

const Step3: React.FC<{ domain: string }> = ({ domain }) => {
  return (
    <RegisterBox title="注册完成" className="flex flex-col text-14px text-grey-normal-hover text-opacity-50 lt-md:text-12px lt-md:leading-14px">
      <div className="mt-54px flex-1 flex justify-center gap-56px lt-md:flex-col">
        {!isMobile() && (
          <div className="text-right text-grey-normal">
            <SuccessIcon className="mb-16px w-80px h-80px" />

            <p>注册成功！</p>
          </div>
        )}

        <div className="lt-md:mt-24px lt-md:flex lt-md:flex-col">
          <p className="flex items-baseline">
            注册域名
            <Domain className="ml-32px text-28px text-grey-normal font-bold lt-md:text-16px lt-md:leading-18px lt-md:ml-8px" domain={domain} />
          </p>

          <p className="mt-16px flex items-baseline">
            有效期至
            <Suspense fallback={' ...'}>
              <ExpireTime domain={domain} />
            </Suspense>
          </p>

          {isMobile() && (
            <div className="text-right text-grey-normal mt-24px">
              <SuccessIcon className="mb-16px w-80px h-80px" />

              <p>注册成功！</p>
            </div>
          )}

          <Link to={`/setting/${domain}`} className="no-underline lt-md:flex-1 lt-md:flex lt-md:items-bottom">
            <Button className="w-152px mt-32px lt-md:w-auto" fullWidth={isMobile()}>
              管理域名
            </Button>
          </Link>
        </div>
      </div>
    </RegisterBox>
  );
};

export default Step3;
