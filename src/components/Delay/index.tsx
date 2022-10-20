import { useState, useEffect, PropsWithChildren } from 'react';

interface Props {
  delay?: number;
}

const Delay = ({ delay = 100, children }: PropsWithChildren<Props>) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;
  return <>{children}</>;
};

export default Delay;
