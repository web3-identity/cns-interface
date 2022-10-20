import React from 'react';
import Button from '@components/Button';
import { RegisterContainer } from '../index';

const Step1: React.FC = () => {
  return (
    <RegisterContainer title="第一步：申请注册" className='flex flex-col text-14px text-grey-normal-hover text-opacity-50 '>
      <div className="mt-40px flex items-center justify-between text-14px">
        <div>
          <p>总计花费</p>

          <p className='mt-2px'>
            <span className="leading-54px text-45px text-grey-normal font-bold">200.00</span>
            <span className='ml-4px'>￥</span>
          </p>
        </div>

        <div>
          <p>注册时长</p>

          <div className='mt-2px'>
            <p>
              <span className="leading-54px text-45px text-grey-normal font-bold">02</span>
              <span className='ml-4px'>年</span>
            </p>
          </div>
        </div>

        <Button>申请</Button>
      </div>

      <p className="mt-auto px-24px py-16px rounded-12px leading-24px bg-#26233E">
        在此步骤中，您可以请求注册并执行两个交易中的第一个。 根据顺序，系统将执行第一个申请，以确保没有其他用户同时注册此域名。 最多需要等待 30 秒。
      </p>
    </RegisterContainer>
  );
};

export default Step1;
