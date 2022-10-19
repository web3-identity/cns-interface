import { BigNumberish, utils } from 'ethers'
import { Contract, sign, format  } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { DEFAULT_PUBLIC_RESOLVER_ADDRESS } from '@web3identity/web3ns/dist/contracts';
import type { FuseOptions } from '../types'
import generateFuseInput from '../generateFuseInput'
import { generateRecordCallArray, RecordOptions } from './recordHelpers'
import { web3domain } from '../cfx';

export const MAX_INT = Number.MAX_SAFE_INTEGER


export type BaseRegistrationParams = {
  owner: string
  duration: number
  secret: string
  resolverAddress?: string
  records?: RecordOptions
  reverseRecord?: boolean
  fuses?: FuseOptions
  wrapperExpiry?: BigNumberish
}

export type RegistrationParams = Omit<
  BaseRegistrationParams,
  'resolverAddress'
> & {
  name: string
  resolver?: Contract
}

export type CommitmentParams = Omit<
  RegistrationParams,
  'secret' | 'wrapperExpiry'|'resolverAddress'
> & {
  secret?: string
  wrapperExpiry?: BigNumberish
  resolverAddress?: string
}

export type RegistrationTuple = [
  name: string,
  owner: string,
  duration: number,
  secret: string,
  resolver: string,
  data: string[],
  reverseRecord: boolean,
  fuses: string,
  wrapperExpiry: BigNumberish,
]

export type CommitmentTuple = [
  labelhash: string,
  owner: string,
  duration: number,
  secret: string,
  resolver: string,
  data: string[],
  reverseRecord: boolean,
  fuses: string,
  wrapperExpiry: BigNumberish,
]

export const randomSecret = () => {
  const bytes = Buffer.allocUnsafe(32)
  return `0x${crypto.getRandomValues(bytes).toString('hex')}`
}

export const makeCommitmentData = ({
  name,
  owner,
  duration,
  resolverAddress,
  records,
  reverseRecord,
  fuses,
  wrapperExpiry,
  secret,
}: CommitmentParams & {
  secret: string
}): CommitmentTuple => {
  const label = labelhash(name.split('.')[0])
  const hash = namehash(name)
  const fuseData = fuses ? generateFuseInput(fuses) : '0'
  const resolverAddr=resolverAddress||DEFAULT_PUBLIC_RESOLVER_ADDRESS
  if (reverseRecord) {
    if (!records) {
      records = { coinTypes: [{ key: 'CFX', value: owner }] }
    } else if (!records.coinTypes?.find((c) => c.key === 'CFX')) {
      if (!records.coinTypes) records.coinTypes = []
      records.coinTypes.push({ key: 'CFX', value: owner })
    }
  }

  const data = records ? generateRecordCallArray(hash, records) : []

  return [
    label,
    owner,
    duration,
    secret,
    resolverAddr,
    data,
    !!reverseRecord,
    fuseData,
    wrapperExpiry || MAX_INT,
  ]
}

export const makeRegistrationData = (
  params: RegistrationParams,
): RegistrationTuple => {
  const commitmentData = makeCommitmentData(params)
  const label = params.name.split('.')[0]
  commitmentData[0] = label
  const secret = commitmentData.splice(5, 1)[0]
  commitmentData.splice(3, 0, secret)
  return commitmentData as unknown as RegistrationTuple
}

// export const _makeCommitment = (params: CommitmentTuple) => {
//   return utils.keccak256(
//     utils.defaultAbiCoder.encode(
//       [
//         'bytes32',
//         'address',
//         'uint256',
//         'address',
//         'bytes[]',
//         'bytes32',
//         'bool',
//         'uint32',
//         'uint64',
//       ],
//       params,
//     ),
//   )
// }

export const _makeCommitment = async(params: CommitmentTuple) => {
  return (await web3domain.Web3Controller.makeCommitment(...params))
}

export const makeCommitment = async({
  secret = randomSecret(),
  ...inputParams
}: CommitmentParams) => {
  const generatedParams = makeCommitmentData({
    ...inputParams,
    secret,
  })
  const commitment = await _makeCommitment(generatedParams)
  return {
    secret,
    commitment,
    wrapperExpiry: generatedParams[8],
  }
}

export function labelhash (label:string) {
  const hashBuf = sign.keccak256(Buffer.from(label))
  return format.hex(hashBuf)
}

export function namehash (inputName:string) {
  // Reject empty names:
  const name = inputName.normalize()
  let node = Buffer.alloc(32)

  if (name) {
    const labels = name.split('.')

    for(let i = labels.length - 1; i >= 0; i--) {
      let labelSha = sign.keccak256(Buffer.from(labels[i]))
      node = sign.keccak256(Buffer.concat([node, labelSha], 64))
    }
  }

  return format.hex(node)
}
