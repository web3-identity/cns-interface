import { useEffect } from 'react';

const usePressEsc = (callback: Function) => {
  useEffect(() => {
    const handleKeypress = (evt: KeyboardEvent) => {
      if (evt?.key !== 'Escape') return;
      callback?.();
    };
    document.addEventListener('keydown', handleKeypress);

    return () => document.removeEventListener('keydown', handleKeypress);
  }, [callback]);
};

export default usePressEsc;
