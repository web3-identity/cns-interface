import { useState, useCallback } from 'react';

const useInTranscation = <T extends (params: any) => Promise<any> | null | undefined>(transcationFunc: T) => {
  const [inTranscation, setInTranscation] = useState(false);
  const execTranscation = useCallback(async (params: any) => {
    setInTranscation(true);
    const res = await transcationFunc(params);
    setInTranscation(false);
    return res;
  }, [transcationFunc]) as T;

  return { inTranscation, execTranscation };
};

export default useInTranscation;