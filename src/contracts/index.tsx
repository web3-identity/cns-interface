import { Contract, providers, type ContractInterface } from 'ethers';
import Web3ControllerABI from './abis/Web3Controller.json';

const HttpProvider = new providers.JsonRpcProvider(import.meta.env.VITE_CoreSpaceRpcUrl);

const createContract = (address: string, ABI: ContractInterface) => {
    const _Contract = new Contract('', ABI, HttpProvider);
    return {
        func: _Contract.interface,
        address
    } as const;
}

export const Web3Controller = createContract('cfxtest:acbrnwph2609zbf21np0501d87xb9dnvuakpv911xk', Web3ControllerABI);