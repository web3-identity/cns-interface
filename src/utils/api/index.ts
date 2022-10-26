import { fetchApi } from '@utils/api/fetchApi';
/**
 * The api of backend
 */

export const postCommitment = (params: object) => fetchApi({ path: 'commit', method: 'POST', params });
export const queryCommitment = (path: string) => fetchApi({ path });
export const postOrder = (path: string, params: object) => fetchApi({ path, method: 'POST', params });
export const queryOrder = (path: string) => fetchApi({ path });
