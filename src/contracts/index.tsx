import { Contract, providers, type ContractInterface } from 'ethers';
import { Web3RegistrarController as Web3ControllerABI } from '@web3identity/cns-contracts'
const HttpProvider = new providers.JsonRpcProvider(import.meta.env.VITE_CoreSpaceRpcUrl);

export const REGISTRY_ADDRESS = 'cfxtest:achg113s8916v2u756tvf6hdvmbsb73b16ykt1pvwm';
export const PUBLIC_RESOLVER_ADDRESS = 'cfxtest:acecxexm0pg268m44jncw5bmagwwmun53jj9msmadj';
export const REVERSE_REGISTRAR_ADDRESS = 'cfxtest:ach1p03gkptxz07p4ecn66gjpd0xrnkkbj1n6p96d5';
export const BASE_REGISTRAR_ADDRESS = 'cfxtest:acc1ttg7287cybsdy6bn0002nzepypn29yavjbj36g';
export const WEB3_CONTROLLER_ADDRESS = 'cfxtest:acbrnwph2609zbf21np0501d87xb9dnvuakpv911xk';
export const NAME_WRAPPER_ADDRESS = 'cfxtest:acdc4xzy0pg1dzrbajgmv8nw3cjyj6ezn2dzncc4w5';

const createContract = (address: string, ABI: ContractInterface) => {
    const _Contract = new Contract('', ABI, HttpProvider);
    return {
        func: _Contract.interface,
        address
    } as const;
}

export const Web3Controller = createContract(WEB3_CONTROLLER_ADDRESS, Web3ControllerABI);