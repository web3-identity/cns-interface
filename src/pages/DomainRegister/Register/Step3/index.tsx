import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/Button';
import { ReactComponent as SuccessIcon } from '@assets/icons/Success.svg';
import { useDomainExpire } from '@service/domainInfo';
import { RegisterBox } from '@pages/DomainRegister';

const ExpireTime: React.FC<{ domain: string; }> = ({ domain }) => {
  const expire = useDomainExpire(domain);
  
  return <>{expire.dateStr}</>;
};

const Step3: React.FC<{ domain: string }> = ({ domain }) => {
  
  return (
    <RegisterBox title="注册完成" className="flex flex-col text-14px text-grey-normal-hover text-opacity-50">
      <div className="mt-54px flex-1 flex justify-center gap-56px">
        <div className="text-right text-grey-normal">
          <SuccessIcon className="mb-16px w-80px h-80px" />

          <p>注册成功！</p>
        </div>

        <div>
          <p className="flex items-center">
            注册域名
            <span className="ml-32px text-28px text-grey-normal font-bold">{domain}.web3</span>
          </p>

          <p className="mt-16px flex items-center">
            有效期至
            <Suspense fallback={' ...'}>
              <ExpireTime domain={domain} />
            </Suspense>
            <span className="ml-32px text-28px text-grey-normal font-bold">20</span>
            <span className="ml-4px mt-6px">年</span>
          </p>
          
          <Link to={`/setting/${domain}`} className="no-underline">
            <Button className='w-152px mt-32px'>管理域名</Button>
          </Link>
        </div>
      </div>
    </RegisterBox>
  );
};

export default Step3;
