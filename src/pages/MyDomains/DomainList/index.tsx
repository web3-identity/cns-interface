import React, { memo, useCallback, Suspense } from 'react';
import { atom, useRecoilState, type SetterOrUpdater } from 'recoil';
import cx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { type ListRowProps } from 'react-virtualized';
import List from 'react-virtualized/dist/es/List';
import WindowScroller from 'react-virtualized/dist/es/WindowScroller';
import { getDimensions } from 'react-virtualized/dist/es/WindowScroller/utils/dimensions';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import Button from '@components/Button';
import Delay from '@components/Delay';
import Spin from '@components/Spin';
import Domain from '@modules/Domain';
import { useMyDomains, useRefreshMyDomains } from '@service/myDomains';
import { useDomainExpire, useRefreshDomainExpire } from '@service/domainInfo';
import { useAccountReverseRegistrar, handleSetAccountReverseRegistrar, useRefreshAccountReverseRegistrar } from '@service/accountReverseRegistrar';
import { usePrefetchSettingPage } from '@service/prefetch';
import useMainScroller from '@hooks/useMainScroller';
import NoDomains from '@assets/images/NoDomains.png';
import { ReactComponent as Logo } from '@assets/icons/logo.svg';

const DomainList: React.FC<{}> = ({}) => {
  const mainScroller = useMainScroller();
  const refreshMyDomains = useRefreshMyDomains();
  const refreshAccountReverseRegistrar = useRefreshAccountReverseRegistrar();
  const refresh = useCallback(() => {
    refreshMyDomains();
    refreshAccountReverseRegistrar();
  }, [refreshMyDomains, refreshAccountReverseRegistrar]);

  return (
    <>
      <div className="mb-26px text-grey-normal text-22px leading-26px lt-md:text-16px lt-md:leading-18px">我的用户名</div>
      <ErrorBoundary fallbackRender={(fallbackProps) => <ListErrorBoundaryFallback {...fallbackProps} />} onReset={refresh}>
        <Suspense fallback={<ListLoading />}>{mainScroller && <MyDomains mainScroller={mainScroller} />}</Suspense>
      </ErrorBoundary>
    </>
  );
};

export default memo(DomainList);


const inTranscationDomainsState = atom<Array<string>>({
  key: 'inTranscationDomains',
  default: []
});

const MyDomains: React.FC<{ mainScroller: HTMLDivElement }> = ({ mainScroller }) => {
  const myDomains = useMyDomains();
  const accountReverseRegistrar = useAccountReverseRegistrar();

  const [inTranscationDomains, setInTranscationDomains] = useRecoilState(inTranscationDomainsState);

  const refreshAccountReverseRegistrar = useRefreshAccountReverseRegistrar();
  const navigate = useNavigate();
  const renderRow = useCallback(
    (props: ListRowProps) => DomainItem({ ...props, accountReverseRegistrar, myDomains, inTranscationDomains, setInTranscationDomains, refreshAccountReverseRegistrar, navigate }),
    [accountReverseRegistrar, inTranscationDomains, myDomains]
  );

  const hasDomain = !!myDomains?.length;

  return (
    <div className="relative flex flex-col rounded-24px bg-purple-dark-active dropdown-shadow lt-md:rounded-none lt-md:bg-transparent">
      {!hasDomain && (
        <div className="flex flex-col justify-center items-center h-340px">
          <img className="w-112px h-88px -mt-16px mb-20px" src={NoDomains} alt="no domains" />
          <p className="text-grey-normal text-14px">
            暂无用户名，去
            <Link className="text-purple-normal" to="/">
              申请
            </Link>
          </p>
        </div>
      )}
      {hasDomain && (
        <WindowScroller scrollElement={mainScroller}>
          {({ height, onChildScroll, scrollTop }) => {
            if (height === undefined) {
              height = getDimensions(mainScroller).height;
            }
            return (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    autoHeight
                    height={height}
                    onScroll={onChildScroll}
                    overscanRowCount={4}
                    rowCount={myDomains.length}
                    rowHeight={94}
                    rowRenderer={renderRow}
                    scrollTop={scrollTop}
                    width={width}
                  />
                )}
              </AutoSizer>
            );
          }}
        </WindowScroller>
      )}
    </div>
  );
};

const DomainItem = ({
  index,
  style,
  key,
  accountReverseRegistrar,
  myDomains,
  inTranscationDomains,
  setInTranscationDomains,
  navigate,
  refreshAccountReverseRegistrar,
}: ListRowProps & {
  accountReverseRegistrar: string | null;
  myDomains: ReturnType<typeof useMyDomains>;
  inTranscationDomains: Array<string>;
  setInTranscationDomains: SetterOrUpdater<Array<string>>;
  refreshAccountReverseRegistrar: VoidFunction;
  navigate: ReturnType<typeof useNavigate>;
}) => {
  const domain = myDomains[index];

  return (
    <div key={key} style={style} className="lt-md:pb-20px h-94px">
      <div className="relative flex justify-between items-center px-24px h-full lt-md:px-16px lt-md:rounded-12px lt-md:bg-purple-dark-active">
        {index !== 0 && <div className="absolute left-24px top-1px w-[calc(100%-48px)] h-1px bg-purple-normal bg-opacity-30 lt-md:display-none select-none pointer-events-none" />}
        <div className="mr-auto flex flex-col gap-6px lt-md:gap-8px">
          <div className="flex items-center">
            <Logo className="mr-8px lt-md:mr-6px w-24px h-24px" />
            <Domain className="text-grey-normal text-22px font-bold lt-md:text-16px leading-26px lt-md:leading-18px" domain={domain} />
            {domain === accountReverseRegistrar && (
              <span className="ml-8px lt-md:ml-5px flex justify-center items-center w-52px h-22px lt-md:h-20px leading-20px lt-md:leading-18px rounded-4px border-1px border-green-normal text-green-normal text-12px md:translate-y-1px">
                已展示
              </span>
            )}
          </div>
          <div className="flex items-center h-18px lt-md:h-14px text-grey-normal-hover text-opacity-50 text-14px lt-md:text-12px">
            <DomainExpire domain={domain} />
          </div>
        </div>

        <Button
          variant="text"
          className={cx('lt-md:display-none mr-28px', { 'opacity-40 pointer-events-none': accountReverseRegistrar === domain })}
          onClick={async () => {
            const curClickDomain = domain;
            await handleSetAccountReverseRegistrar({
              domain,
              navigate,
              refreshAccountReverseRegistrar,
              from: 'setting',
              inTransitionCallback: () => setInTranscationDomains((pre) => [...pre, curClickDomain]),
            });
            setInTranscationDomains((pre) => pre.filter((domain) => domain !== curClickDomain));
          }}
          loading={inTranscationDomains?.includes?.(domain)}
        >
          {accountReverseRegistrar === domain ? '已设为展示' : '设为展示'}
        </Button>
        <GotoDomainSettingButton domain={domain} />

        <span className="i-dashicons:arrow-right-alt2 text-24px text-grey-normal md:display-none flex-shrink-0" />
      </div>
    </div>
  );
};

const GotoDomainSettingButton = memo(({ domain }: { domain: string }) => {
  const prefetchSettingPage = usePrefetchSettingPage(domain);

  return (
    <>
      <Link to={`/setting/${domain}`} className="no-underline lt-md:display-none" onMouseEnter={prefetchSettingPage} draggable="false">
        <Button className="min-w-128px">管理</Button>
      </Link>
      <Link to={`/setting/${domain}`} className="absolute w-full h-full left-0 top-0 no-underline md:display-none md:pointer-events-none" onMouseEnter={prefetchSettingPage} draggable="false" />
    </>
  );
});

const ListLoading: React.FC = () => {
  return (
    <Delay>
      <div className="relative h-340px rounded-24px bg-purple-dark-active dropdown-shadow lt-md:rounded-none lt-md:bg-transparent">
        <Spin className="!absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+16px)] text-60px" />
      </div>
    </Delay>
  );
};

const ListErrorBoundaryFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => (
  <div className="relative flex flex-col justify-center items-center h-340px rounded-24px bg-purple-dark-active dropdown-shadow lt-md:rounded-none lt-md:bg-transparent">
    <p className="-mt-16px mb-12px text-center text-14px text-error-normal">获取列表失败</p>
    <Button size="small" className="mx-auto mb-12px" onClick={resetErrorBoundary}>
      重试
    </Button>
  </div>
);

const DomainExpire: React.FC<{ domain: string }> = ({ domain }) => {
  const refreshDomainExpire = useRefreshDomainExpire(domain);

  return (
    <ErrorBoundary fallbackRender={(fallbackProps) => <ExpireErrorBoundaryFallback {...fallbackProps} />} onReset={refreshDomainExpire}>
      <Suspense fallback={<ExpireLoading />}>
        <ExpireTime domain={domain} />
      </Suspense>
    </ErrorBoundary>
  );
};

const ExpireTime: React.FC<{ domain: string }> = ({ domain }) => {
  const { dateFormatForSecond, gracePeriod, isExpired } = useDomainExpire(domain);

  return (
    <>
      {!isExpired ? (
        <>
          预计到期
          <span className="ml-8px text-grey-normal lt-md:ml-4px">{dateFormatForSecond}</span>
        </>
      ) : (
        <>
          用户名已到期，将于<span className="text-grey-normal font-bold"> {gracePeriod} </span>天后回收
        </>
      )}
    </>
  );
};

const ExpireLoading: React.FC = () => <Delay mode="opacity">获取到期时间中...</Delay>;

const ExpireErrorBoundaryFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => (
  <span className="text-error-normal cursor-pointer select-none group" onClick={resetErrorBoundary}>
    获取到期时间失败，<span className="underline group-hover:underline-none">点此重试</span>
  </span>
);
