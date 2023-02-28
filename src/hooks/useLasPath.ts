
import { useEffect, useRef } from 'react';
import { atom, useRecoilValue  } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { useLocation } from 'react-router-dom';

const prePageState = atom<string | null>({ key: 'prePage', default: null });

export const useWatchPathChange = () => {
  const { pathname: curPath } = useLocation();
  const prePath = useRef<string | null>(null);
  useEffect(() => {
    setRecoil(prePageState, prePath.current);
    prePath.current = curPath;
  }, [curPath]);
};

const useLasPath = () => useRecoilValue(prePageState);

export default useLasPath;