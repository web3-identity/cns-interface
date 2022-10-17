import React, { useState, useCallback, memo, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import LinearBorderBox from '@components/LinearBorderBox';
import Input from '@components/Input';
import Button from '@components/Button';
import { useDomainStatus } from './service';

interface Props {}

const StatusSearch: React.FC = () => {
  const [domain, setDomain] = useState('');
  const { register, handleSubmit: withForm, formState: { errors } } = useForm();

  const handleContinue = useCallback(withForm(({ domain }) => setDomain(domain)), []);

  return (
    <form onSubmit={handleContinue}>
      <LinearBorderBox className="relative flex items-center h-92px pl-16px pr-12px rounded-24px" withInput>
        <Input
          size="medium"
          prefixIcon="i-charm:search"
          placeholder="获取您的.web3"
          {...register('domain', {
            required: true,
            pattern: /^[0-9A-Za-z]+$/,
          })}
        />
        {errors?.domain?.type === 'pattern' && <span className="absolute bottom-0 translate-y-3/2 text-red-500">域名包含不支持的字符</span>}
        <Button size="medium">搜索</Button>
        <Suspense fallback={<div>loading</div>}>
          {domain && <Status domain={domain}/>}
        </Suspense>
      </LinearBorderBox>
    </form>
  );
};

const Status: React.FC<{ domain: string }> = ({ domain }) => {
  const status = useDomainStatus(domain);
  console.log(status)
  return <div className='text-red-200'>{status}</div>;
};

export default memo(StatusSearch);
