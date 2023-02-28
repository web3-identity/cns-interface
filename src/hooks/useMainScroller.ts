import { useLayoutEffect } from 'react';
import { atom, useRecoilValue, useRecoilState } from 'recoil';
import isDOMElement from '@utils/isDOMElement';
import { throttle } from 'lodash-es';

const mainScroller = atom<HTMLDivElement | null>({
  key: 'mainScroller',
  default: null,
});

const mainScrollerDistance = atom<number>({
  key: 'mainScrollerDistance',
  default: 0,
});

export const useSetMainScroller = () => {
  const [scroller, setMainScroller] = useRecoilState(mainScroller);
  const [_, setMainScrollerDistance] = useRecoilState(mainScrollerDistance);

  useLayoutEffect(() => {
    if (!scroller) {
      const mainScroller = document.querySelector('.main-scroller') as HTMLDivElement;
      if (isDOMElement(mainScroller)) {
        setMainScroller(mainScroller);
        setMainScrollerDistance(mainScroller.scrollTop);
        const handleScroll = throttle((evt: Event) => {
          if (typeof globalThis.requestIdleCallback === 'function') {
            requestIdleCallback(() => {
              setMainScrollerDistance((evt.target as HTMLDivElement)?.scrollTop || 0);
            });
          } else {
            setMainScrollerDistance((evt.target as HTMLDivElement)?.scrollTop || 0);
          }
        }, 50);
        mainScroller.addEventListener('scroll', handleScroll);

        return () => mainScroller.removeEventListener('scroll', handleScroll);
      }
    }
  }, []);

  return scroller;
};

export const useMainScrollerDistance = () => useRecoilValue(mainScrollerDistance);

export default () => useRecoilValue(mainScroller);
