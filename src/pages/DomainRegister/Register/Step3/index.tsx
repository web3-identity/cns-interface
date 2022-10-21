import React from 'react';
import Button from '@components/Button';
import { RegisterContainer } from '../index';
import { ReactComponent as SuccessIcon } from '@assets/icons/Success.svg';

const Step3: React.FC<{ domain: string }> = ({ domain }) => {
  return (
    <RegisterContainer title="第一步：申请注册" className="flex flex-col text-14px text-grey-normal-hover text-opacity-50">
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
            注册时长
            <span className="ml-32px text-28px text-grey-normal font-bold">20</span>
            <span className="ml-4px mt-6px">年</span>
          </p>

          <Button className='w-152px mt-32px h-44px' color='gradient'>去设置</Button>
        </div>
      </div>
    </RegisterContainer>
  );
};

export default Step3;
