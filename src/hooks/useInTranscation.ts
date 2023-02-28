import { useState, useCallback } from 'react';

const useInTranscation = <T extends (params: any) => void | Promise<any> | null | undefined>(transcationFunc: T) => {
  const [inTranscation, setInTranscation] = useState(false);
  const execTranscation = useCallback(async (params: any) => {
    try {
      setInTranscation(true);
      const res = await transcationFunc(params);
      setInTranscation(false);
      return res;
    } catch(_) {
      setInTranscation(false);
    }
  }, [transcationFunc]) as T;

  return { inTranscation, execTranscation };
};

export default useInTranscation;