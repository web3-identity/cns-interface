import { fetchApi } from '@utils/api/fetchApi';
/**
 * The api of backend
 */
export const postCommitment = (params: object) => fetchApi({ path: 'commits', method: 'POST', params });
export const queryCommitment = (path: string) => fetchApi({ path });
export const postOrder = (commitmentHash: string, params: object) => fetchApi({ path:'orders/'+commitmentHash, method: 'POST', params });
export const queryOrder = (path: string) => fetchApi({ path });
