import { Contract, providers, type ContractInterface } from 'ethers';
import { Web3RegistrarController as Web3ControllerABI, PublicResolver as PublicResolverABI } from '@web3identity/cns-contracts';
import { convertCfxToHex } from '@utils/addressUtils';
export const HttpProvider = new providers.JsonRpcProvider(import.meta.env.VITE_CoreSpaceRpcUrl);

const isProduction = import.meta.env.MODE === 'production';

const createContract = (address: string, ABI: ContractInterface) => {
  const _Contract = new Contract('', ABI, HttpProvider);
  return {
    func: _Contract.interface,
    address,
    hexAddress: convertCfxToHex(address),
  } as const;
};

export const Web3Controller = createContract(
  isProduction ? 'cfxtest:acbrnwph2609zbf21np0501d87xb9dnvuakpv911xk' : 'cfxtest:acbrnwph2609zbf21np0501d87xb9dnvuakpv911xk',
  Web3ControllerABI
);

export const PublicResolver = createContract(
  isProduction ? 'cfxtest:acecxexm0pg268m44jncw5bmagwwmun53jj9msmadj' : 'cfxtest:acecxexm0pg268m44jncw5bmagwwmun53jj9msmadj',
  PublicResolverABI
);
