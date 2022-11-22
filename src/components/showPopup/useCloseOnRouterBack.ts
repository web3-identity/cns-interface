import { useLayoutEffect } from 'react';

const useCloseOnRouterBack = (closeModal: VoidFunction) => {
  useLayoutEffect(() => {
    history.replaceState(null, '', '');
    history.pushState(null, '', '#modal');

    const handleCloseModal = () => {
      closeModal?.();
    }

    window.addEventListener('popstate', handleCloseModal);
    return () => {
      window.removeEventListener('popstate', handleCloseModal);
    };
  }, []);
};

export default useCloseOnRouterBack;
