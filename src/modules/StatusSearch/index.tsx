import React, { useState, useCallback, useEffect, memo, type HTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import cx from 'clsx';
import BorderBox from '@components/Box/BorderBox';
import Input from '@components/Input';
import Button from '@components/Button';
import Status from '@modules/Status';

interface Props {
  where: 'home' | 'header';
}

const StatusSearch: React.FC<Props & HTMLAttributes<HTMLDivElement>> = ({ where, className, ...props }) => {
  const { register, handleSubmit: withForm, watch } = useForm();
  const [domain, setDomain] = useState('');
  useEffect(() => setDomain(''), [watch('domain')]);

  const handleSearch = useCallback(withForm(({ domain }) => setDomain((domain as string).toLowerCase().trim())), []);

  return (
    <form onSubmit={handleSearch} className={cx('relative', className)}>
      <BorderBox
        variant={where === 'home' ? 'gradient' : 'purple'}
        className={cx('relative flex items-center', {
          'h-92px pl-16px pr-12px rounded-24px': where === 'home',
          'min-w-380px h-48px pl-12px pr-8px rounded-10px border-2px border-purple-normal': where === 'header',
        })}
        withInput
        {...props}
      >
        <Input
          className="lowercase"
          size={where === 'header' ? 'normal' : 'medium'}
          prefixIcon="i-charm:search"
          placeholder="获取您的.web3"
          {...register('domain', { required: true })}
        />
        {!domain && <Button size={where === 'header' ? 'small' : 'medium'}>搜索</Button>}
      </BorderBox>

      {domain && (
        <Status
          domain={domain}
          where={where}
          className={cx('absolute left-0 w-full z-10', {
            'top-[calc(100%+16px)]': where === 'home',
            'top-[calc(100%+8px)]': where === 'header',
          })}
        />
      )}
    </form>
  );
};

export default memo(StatusSearch);
