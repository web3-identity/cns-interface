import React from 'react';
import Spin from '@components/Spin';
import { RegisterContainer } from '../index';

const WaitCommitConfirm: React.FC<{ domain: string }> = ({ domain }) => {

  return (
    <RegisterContainer title="第一步：申请注册" className="flex flex-col text-14px text-grey-normal">
      <Spin className='mx-auto mt-56px mb-16px text-80px'/>
      <p className='text-center'>正在确认你申请的注册内容...</p>
    </RegisterContainer>
  );
};

export default WaitCommitConfirm;
