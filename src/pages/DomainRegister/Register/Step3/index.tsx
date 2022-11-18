import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import Domain from '@modules/Domain';
import Button from '@components/Button';
import { ReactComponent as SuccessIcon } from '@assets/icons/Success.svg';
import { useDomainExpire } from '@service/domainInfo';
import { RegisterBox } from '@pages/DomainRegister';

const ExpireTime: React.FC<{ domain: string }> = ({ domain }) => {
  const { date } = useDomainExpire(domain) ?? {};

  return (
    <span className="inline-flex items-baseline gap-3px ml-24px text-28px text-grey-normal font-bold lt-md:text-16px lt-md:ml-8px md:translate-y-1px">
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
      <div className="mt-54px lt-md:mt-20px flex flex-row-reverse justify-center gap-72px lt-md:flex-col lt-md:gap-28px">
        <div>
          <p className="flex items-baseline">
            注册域名
            <Domain className="ml-24px text-28px text-grey-normal font-bold lt-md:text-16px lt-md:ml-8px md:translate-y-1px" domain={domain} />
          </p>

          <p className="mt-20px flex items-baseline">
            有效期至
            <Suspense fallback={' ...'}>
              <ExpireTime domain={domain} />
            </Suspense>
          </p>
        </div>

        <div className="text-right text-grey-normal lt-md:self-center">
          <SuccessIcon className="mb-16px w-80px h-80px" />
          <p className='text-14px'>注册成功！</p>
        </div>
      </div>

      <Link to={`/setting/${domain}`} className="mx-auto no-underline md:-translate-x-13px lt-md:mt-auto lt-md:w-full">
        <Button className="w-152px lt-md:w-full">管理域名</Button>
      </Link>
    </RegisterBox>
  );
};

export default Step3;
