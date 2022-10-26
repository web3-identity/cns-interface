import { fetchApi } from '@utils/fetch';

/**
 * Serialize the parameters of the contract into the parameters of the API
 * @param commitmentHash the hash of commitment
 * @param params the params that post to contract
 * @returns
 */
const generateCommitmentParams = (commitmentHash: string, params: Array<any>) => {
  return {
    commit_hash: commitmentHash,
    name: params[0],
    owner: params[1],
    duration: params[2],
    secret: params[3],
    resolver: params[4],
    data: params[5],
    reverse_record: params[6],
    fuses: params[7],
    wrapper_expiry: params[8],
  };
};

/**
 * The api of backend
 */
export const postCommitmentToBackend = (commitmentHash: string, params: Array<any>)  => fetchApi({ path: 'commits', method: 'POST', params: generateCommitmentParams(commitmentHash, params) });
export const queryCommitment = (path: string) => fetchApi({ path });
