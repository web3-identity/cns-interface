import React, { useState, useCallback, useLayoutEffect, memo, type HTMLAttributes } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import cx from 'clsx';
import BorderBox from '@components/Box/BorderBox';
import Input from '@components/Input';
import Button from '@components/Button';
import Status from '@modules/StatusSearch/Status';
import './index.css';

interface Props {
  where: 'home' | 'header';
}

const StatusSearch: React.FC<Props & HTMLAttributes<HTMLDivElement>> = ({ where, className, ...props }) => {
  const { pathname } = useLocation();
  const { register, handleSubmit: withForm, watch, setValue } = useForm();
  const [domain, setDomain] = useState('');
  const currentInput = watch('domain');
  useLayoutEffect(() => setDomain(''), [currentInput, pathname]);
  useLayoutEffect(() => setValue('domain', ''), [pathname]);

  const handleSearch = useCallback(withForm(({ domain }) => setDomain((domain as string).toLowerCase().trim())), []);

  return (
    <form onSubmit={handleSearch} className={cx('relative', className)}>
      <BorderBox
        variant={where === 'home' ? 'gradient' : 'purple'}
        className={cx(`status-search-${where} flex items-center`, {
          'relative h-92px pl-16px pr-12px rounded-24px': where === 'home',
          'min-w-400px h-48px pl-12px pr-8px rounded-10px border-2px border-purple-normal': where === 'header',
          '!opacity-100 !pointer-events-auto': domain || currentInput
        })}
        withInput
        {...props}
      >
        <Input
          id="status-search"
          className="lowercase"
          size={where === 'header' ? 'normal' : 'medium'}
          prefixIcon="i-charm:search"
          placeholder="获取您的.web3"
          autoFocus={where === 'home'}
          {...register('domain', { required: true })}
        />
        {!domain && <Button size={where === 'header' ? 'small' : 'medium'}>搜索</Button>}
      </BorderBox>

      {where === 'header' && (
        <label
          className={cx(
            'absolute top-0 right-0 w-48px h-48px flex justify-center items-center rounded-10px bg-#3F3F69 cursor-pointer',
            (currentInput || domain) && 'opacity-0 pointer-events-none'
          )}
          htmlFor="status-search"
        >
          <span className="i-charm:search text-27.5px" />
        </label>
      )}

      {domain && (
        <Status
          domain={domain}
          where={where}
          className={cx('!absolute left-0 w-full z-10', {
            'top-[calc(100%+16px)]': where === 'home',
            'top-[calc(100%+8px)]': where === 'header',
          })}
        />
      )}
    </form>
  );
};

export default memo(StatusSearch);
