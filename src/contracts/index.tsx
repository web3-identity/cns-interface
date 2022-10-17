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

export const Web3Controller = createContract('cfxtest:acc44su6m7sm6mksmdbvcnh9rp6ukj2yva7ee43nzy', Web3ControllerABI);