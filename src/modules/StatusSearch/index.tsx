import React, { useState, useCallback, useEffect, memo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import cx from 'clsx';
import LinearBorderBox from '@components/LinearBorderBox';
import Input from '@components/Input';
import Button from '@components/Button';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import { useDomainStatus, useRefreshDomainStatus, DomainStatus } from '@service/domain/status';
import { ReactComponent as StatusLocked } from '@assets/icons/StatusLocked.svg';
import { ReactComponent as StatusRegistered } from '@assets/icons/StatusRegistered.svg';
import { ReactComponent as StatusReserved } from '@assets/icons/StatusReserved.svg';
import { ReactComponent as StatusValid } from '@assets/icons/StatusValid.svg';

interface Props {
  where?: 'home' | 'header';
}

const StatusSearch: React.FC<Props> = () => {
  const { register, handleSubmit: withForm, watch } = useForm();
  const [domain, setDomain] = useState('');
  useEffect(() => setDomain(''), [watch('domain')]);

  const handleSearch = useCallback(withForm(({ domain }) => setDomain((domain as string).toLowerCase().trim())), []);
  const handleRefresh = useRefreshDomainStatus(domain);

  return (
    <form onSubmit={handleSearch}>
      <LinearBorderBox className="relative flex items-center h-92px pl-16px pr-12px rounded-24px" withInput>
        <Input
          className="lowercase"
          size="medium"
          prefixIcon="i-charm:search"
          placeholder="获取您的.web3"
          {...register('domain', { required: true })}
        />
        {!domain && <Button size="medium">搜索</Button>}
      </LinearBorderBox>

      {domain &&
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={handleRefresh}>
          <Suspense fallback={<StatusLoading />}>
            <Status domain={domain}/>
          </Suspense>
        </ErrorBoundary>
      }
    </form>
  );
};

const statusMap = {
  [DomainStatus.Valid]: {
    icon: StatusValid,
    text: '可注册',
    color: 'text-green-normal'
  },
  [DomainStatus.Registered]: {
    icon: StatusRegistered,
    text: '已注册',
    color: 'text-#FF9900',
  },
  [DomainStatus.Reserved]: {
    icon: StatusReserved,
    text: '未开放',
    color: 'text-#83828F'
  },
  [DomainStatus.Locked]: {
    icon: StatusLocked,
    text: '已锁定',
    color: 'text-purple-normal'
  },
  [DomainStatus.TooShort]: {
    icon: StatusLocked,
    text: '域名太短',
    color: 'text-red-500'
  },
  [DomainStatus.IllegalChar]: {
    icon: StatusLocked,
    text: '域名包含不支持的字符',
    color: 'text-red-500'
  }
} as const;

const Status: React.FC<{ domain: string }> = ({ domain }) => {
  const status = useDomainStatus(domain);
  
  const Icon = statusMap[status].icon;
  return (
    <div
      className={cx("mt-16px flex items-center h-92px pl-24px pr-12px rounded-24px text-22px bg-purple-dark-active", statusMap[status].color)}
    >
      <Icon className='mr-12px w-40px h-40px -translate-y-2px'/>
      <span>{statusMap[status].text}</span>
      <span className='ml-8px mr-auto font-bold'>{domain}.web3</span>
      
      {status === DomainStatus.Valid && 
        <Link to={`/register/${domain}`}>
          <Button>注册</Button>
        </Link>
      }
      {status === DomainStatus.Registered && 
        <Link to={`/setting/${domain}`}>
          <Button>查看</Button>
        </Link>
      }
    </div>
  );
};


const StatusLoading: React.FC = () => (
  <Delay>
    <div className="mt-16px flex items-center h-92px pl-24px pr-12px rounded-24px text-32px text-green-normal bg-purple-dark-active">
      <Spin />
    </div>
  </Delay>
);

const ErrorBoundaryFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => (
  <div className="mt-16px flex items-center h-92px pl-24px pr-12px rounded-24px text-22px text-red-500 bg-purple-dark-active cursor-pointer">
    <StatusLocked className='mr-12px w-40px h-40px -translate-y-2px'/>
    <span className='mr-auto'>网络错误</span>
    <Button onClick={resetErrorBoundary}>重试</Button>
  </div>
);

export default memo(StatusSearch);
