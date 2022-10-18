import React, { useState, useCallback, useEffect, memo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import cx from 'clsx';
import { useForm } from 'react-hook-form';
import LinearBorderBox from '@components/LinearBorderBox';
import Input from '@components/Input';
import Button from '@components/Button';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import { useDomainStatus, DomainStatus } from '@service/domain/status';

interface Props {
  where?: 'home' | 'header';
}

const StatusSearch: React.FC<Props> = () => {
  const { register, handleSubmit: withForm, formState: { errors }, watch } = useForm();
  
  const [domain, setDomain] = useState('');
  useEffect(() => setDomain(''), [watch('domain')]);

  const handleContinue = useCallback(withForm(({ domain }) => setDomain((domain as string).toLowerCase())), []);

  return (
    <form onSubmit={handleContinue}>
      <LinearBorderBox className="relative flex items-center h-92px pl-16px pr-12px rounded-24px" withInput>
        <Input
          className="lowercase"
          size="medium"
          prefixIcon="i-charm:search"
          placeholder="获取您的.web3"
          {...register('domain', {
            required: true,
            // pattern: /^[0-9A-Za-z]+$/,
          })}
        />
        {/* {errors?.domain?.type === 'pattern' && <span className="absolute bottom-0 translate-y-3/2 text-red-500">域名包含不支持的字符</span>} */}
        <Button size="medium">搜索</Button>
      </LinearBorderBox>

      {domain &&
        <Suspense fallback={<StatusLoading />}>
          <Status domain={domain}/>
        </Suspense>
      }
    </form>
  );
};

const StatusLoading: React.FC = () => (
  <Delay>
    <div className="mt-16px flex items-center h-92px pl-24px pr-12px rounded-24px text-32px text-green-normal bg-purple-dark-active">
      <Spin />
    </div>
  </Delay>
);

const Status: React.FC<{ domain: string }> = ({ domain }) => {
  const status = useDomainStatus(domain);

  return (
    <div
      className={cx("mt-16px flex items-center h-92px pl-24px pr-12px rounded-24px bg-purple-dark-active", {
        "text-green-normal": status === DomainStatus.Valid,
        "text-#FF9900": status === DomainStatus.Registered,
        "text-#83828F": status === DomainStatus.Reserved,
        "text-purple-normal": status === DomainStatus.Reserved,
        "text-red-500": status === DomainStatus.TooShort || status === DomainStatus.IllegalChar,
      })}
    >
      <span>
        {status === DomainStatus.Valid && '可注册'}
        {status === DomainStatus.Registered && '已注册'}
        {status === DomainStatus.Reserved && '未开放'}
        {status === DomainStatus.Locked && '已锁定'}
        {status === DomainStatus.TooShort && '域名太短'}
        {status === DomainStatus.IllegalChar && '域名包含不支持的字符'}
      </span>
      <span className='ml-8px'>{domain}.web3</span>
      
      {status === DomainStatus.Valid && <Button className='ml-auto'>注册</Button>}
      {status === DomainStatus.Registered && <Button className='ml-auto'>查看</Button>}
    </div>
  );
};

export default memo(StatusSearch);
