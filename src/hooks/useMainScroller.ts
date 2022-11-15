import { useState, useEffect } from 'react';

let mainScroller: HTMLDivElement | null = null;
const useMainScroller = () => {
  const [scroller, setMainScroller] = useState<HTMLDivElement | null>(() => mainScroller);
  useEffect(() => {
    if (!mainScroller) {
      mainScroller = document.querySelector('.main-scroller');
      setMainScroller(mainScroller);
    }
  }, []);

  return scroller;
};

export default useMainScroller;