import { CommitmentParams, makeCommitment,labelhash } from '@utils/helper/registerHelper'
import {CNS_TLD} from '@utils/constant'
import { web3domain } from '@utils/cfx';

type Params = Omit<CommitmentParams, 'name'> & {
}

/**
 * 
 * @param name cns name
 * @param params request params
 * @param account your wallet account
 * @returns 
 */
export default async function (
  name: string,
  account: string,
  params:Params,
) {
  const labels = name.split('.')
  if (labels.length !== 2 || labels[1] !== CNS_TLD)
    throw new Error('Currently only .'+CNS_TLD+' TLD registrations are supported')

  const { secret, commitment, wrapperExpiry } = await makeCommitment({
    name,
    ...params,
  })
  const txHash=await web3domain.Web3Controller.commitWithName(commitment,labelhash(labels[0])).sendTransaction({ from: account })
  return {
    txHash,
    customData: {
      secret,
      commitment,
      wrapperExpiry,
    },
  }
}
