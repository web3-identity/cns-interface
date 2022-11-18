import { atom, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';

const isLtMdState = atom({
  key: 'isLtMd',
  default: window.innerWidth < 768
});

const handleResize = () => {
  try {
    setRecoil(isLtMdState, window.innerWidth < 768)
  } catch (_) {

  }
};

window.addEventListener('resize', handleResize);

const useIsLtMd = () => useRecoilValue(isLtMdState);
export default useIsLtMd;
