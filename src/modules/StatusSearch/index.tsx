import React, { useState, useCallback, useLayoutEffect, memo, type ComponentProps } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import cx from 'clsx';
import isMobile from '@utils/isMobie';
import BorderBox from '@components/Box/BorderBox';
import Input from '@components/Input';
import Button from '@components/Button';
import Status from '@modules/StatusSearch/Status';
import useIsLtMd from '@hooks/useIsLtMd';
import './index.css';

interface Props {
  where: 'home' | 'header';
}

export const btnClassMap = {
  header: 'px-0 w-56px h-32px text-14px rounded-6px',
  home: 'w-200px h-60px text-28px rounded-16px lt-md:w-68px lt-md:h-40px lt-md:text-16px lt-md:rounded-8px',
} as const;

const StatusSearch: React.FC<Props & ComponentProps<'div'>> = ({ where, className, ...props }) => {
  const isLtMd = useIsLtMd();
  const isSmall = where === 'header' || isLtMd;

  const { pathname } = useLocation();
  const { register, handleSubmit: withForm, watch, setValue } = useForm();
  const [domain, setDomain] = useState('');
  const currentInput = watch('domain');
  useLayoutEffect(() => setDomain(''), [currentInput, pathname]);
  useLayoutEffect(() => setValue('domain', ''), [pathname]);

  const handleSearch = useCallback(
    withForm(({ domain }) => setDomain((domain as string).toLowerCase().trim())),
    []
  );

  return (
    <form onSubmit={handleSearch} className={cx('relative', className)}>
      <BorderBox
        variant={where === 'home' ? 'gradient' : 'purple'}
        className={cx(`status-search-${where} flex items-center`, {
          'relative h-92px lt-md:h-56px rounded-24px lt-md:rounded-12px': where === 'home',
          'min-w-368px h-48px rounded-10px': where === 'header',
          '!opacity-100 !pointer-events-auto': domain || currentInput,
          'pl-24px pr-12px text-22px': !isSmall,
          'pl-12px pr-8px text-16px': isSmall,
        })}
        withInput
        {...props}
      >
        <Input
          id="status-search"
          className={cx("lowercase", isSmall && "font-normal !pl-0")}
          size={isSmall ? 'normal' : 'medium'}
          prefixIcon={!isSmall ? 'i-charm:search' : ''}
          placeholder="获取您的.web3"
          autoFocus={where === 'home' && !isMobile()}
          {...register('domain', { required: true })}
        />
        {!domain && (
          <Button className={btnClassMap[where]}>
            {!isSmall && <span>搜索</span>}
            {isSmall && <span className="i-charm:search text-28px text-grey-normal font-bold" />}
          </Button>
        )}
      </BorderBox>

      {where === 'header' && (
        <label
          className={cx(
            'absolute top-0 right-0 w-48px h-48px flex justify-center items-center rounded-10px bg-#3F3F69 cursor-pointer',
            (currentInput || domain) && 'opacity-0 pointer-events-none'
          )}
          htmlFor="status-search"
        >
          <span className="i-charm:search text-28px text-grey-normal font-bold" />
        </label>
      )}

      {domain && (
        <Status
          domain={domain}
          where={where}
          isSmall={isSmall}
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
