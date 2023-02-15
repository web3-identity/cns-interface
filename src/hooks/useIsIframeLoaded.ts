import { useState, useLayoutEffect, useRef } from 'react';

const useIsIframeLoaded = (src?: string) => {
  const iframeEle = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    if (!iframeEle.current) return;
    setLoaded(false);
    iframeEle.current.contentWindow?.location.replace(src || '');
  }, [src]);

  useLayoutEffect(() => {
    if (!iframeEle.current) return;
    const handleLoad = () => {
      setLoaded(true);
    };

    iframeEle.current.addEventListener('load', handleLoad);
    return () => iframeEle.current?.removeEventListener('load', handleLoad);
  }, []);

  return [iframeEle, loaded] as const;
};

export default useIsIframeLoaded;
