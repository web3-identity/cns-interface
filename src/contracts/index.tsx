import { Contract, providers, type ContractInterface } from 'ethers';
import { Web3RegistrarController as Web3ControllerABI } from '@web3identity/cns-contracts'
export const HttpProvider = new providers.JsonRpcProvider(import.meta.env.VITE_CoreSpaceRpcUrl);

const createContract = (address: string, ABI: ContractInterface) => {
    const _Contract = new Contract('', ABI, HttpProvider);
    return {
        func: _Contract.interface,
        address
    } as const;
}

export const Web3Controller = createContract(import.meta.env.VITE_WEB3_CONTROLLER, Web3ControllerABI);