import React, { memo, Suspense, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
import { usePrefetchSettingPage } from '@service/prefetch';
import useMainScroller from '@hooks/useMainScroller';
import NoDomains from '@assets/images/NoDomains.png';

const DomainList: React.FC<{}> = ({}) => {
  const mainScroller = useMainScroller();
  const refreshMyDomains = useRefreshMyDomains();

  return (
    <>
      <div className="mb-26px text-grey-normal text-22px leading-26px lt-md:text-16px lt-md:leading-18px">注册人</div>
      <ErrorBoundary fallbackRender={(fallbackProps) => <ListErrorBoundaryFallback {...fallbackProps} />} onReset={refreshMyDomains}>
        <Suspense fallback={<ListLoading />}>{mainScroller && <MyDomains mainScroller={mainScroller} />}</Suspense>
      </ErrorBoundary>
    </>
  );
};

export default memo(DomainList);

const MyDomains: React.FC<{ mainScroller: HTMLDivElement }> = ({ mainScroller }) => {
  const myDomains = useMyDomains();
  const renderRow = useCallback((props: ListRowProps) => DomainItem({ ...props, myDomains }), [myDomains]);
  const hasDomain = !!myDomains?.length;

  return (
    <div className="relative flex flex-col rounded-24px bg-purple-dark-active dropdown-shadow lt-md:rounded-none lt-md:bg-transparent">
      {!hasDomain && (
        <div className="flex flex-col justify-center items-center h-340px">
          <img className="w-112px h-88px -mt-16px mb-20px" src={NoDomains} alt="no domains" />
          <p className="text-grey-normal text-14px">
            暂无域名，去
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

const DomainItem = ({ index, style, key, myDomains }: ListRowProps & { myDomains: ReturnType<typeof useMyDomains> }) => {
  const domain = myDomains[index];

  return (
    <div key={key} style={style} className="lt-md:pb-20px h-94px">
      <div className="relative flex justify-between items-center px-24px h-full lt-md:px-16px lt-md:rounded-12px lt-md:bg-purple-dark-active">
        {index !== 0 && <div className="absolute left-24px top-1px w-[calc(100%-48px)] h-1px bg-purple-normal bg-opacity-30 lt-md:display-none select-none pointer-events-none" />}
        <div className="mr-auto flex flex-col gap-6px lt-md:gap-8px">
          <Domain className="text-grey-normal text-22px font-bold lt-md:text-16px leading-26px lt-md:leading-18px" domain={domain} />
          <div className="flex items-center h-18px lt-md:h-14px text-grey-normal-hover text-opacity-50 text-14px lt-md:text-12px">
            <DomainExpire domain={domain} />
          </div>
        </div>

        {/* <Button variant="text" className="lt-md:display-none mr-28px">
          续费
        </Button> */}
        <GotoDomainSettingButton domain={domain} />

        <span className="i-dashicons:arrow-right-alt2 text-24px text-grey-normal md:display-none" />
        <Link to={`/setting/${domain}`} className="absolute w-full h-full left-0 top-0 no-underline md:display-none" />
      </div>
    </div>
  );
};

const GotoDomainSettingButton = memo(({ domain }: { domain: string }) => {
  const prefetchSettingPage = usePrefetchSettingPage(domain);

  return (
    <Link to={`/setting/${domain}`} className="no-underline lt-md:display-none" onMouseEnter={prefetchSettingPage} draggable="false">
      <Button>域名管理</Button>
    </Link>
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
          域名已到期，将于<span className="text-grey-normal font-bold"> {gracePeriod} </span>天后回收
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
