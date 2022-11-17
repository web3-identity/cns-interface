import { useState, useEffect } from 'react';
import { debounce } from 'lodash-es';

const useIsLtMd = () => {
  const [isMdScreen, setIsMdScreen] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMdScreen(window.innerWidth < 768);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMdScreen;
};

export default useIsLtMd;
