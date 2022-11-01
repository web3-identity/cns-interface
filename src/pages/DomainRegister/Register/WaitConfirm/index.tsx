import React from 'react';
import Spin from '@components/Spin';
import { RegisterBox } from '@pages/DomainRegister';

const WaitCommitConfirm: React.FC<{ type: 'waitCommitConfirm' | 'waitPayConfirm' }> = ({ type }) => {

  return (
    <RegisterBox title="第一步：申请注册" className="flex flex-col text-14px text-grey-normal">
      <Spin className='mx-auto mt-56px mb-16px text-80px'/>
      <p className='text-center'>
        {type === 'waitCommitConfirm' ? '正在确认你申请的注册内容...' : '区块链确认中...'}
      </p>
    </RegisterBox>
  );
};

export default WaitCommitConfirm;
