import { atom } from 'recoil';
import { setRecoil } from 'recoil-nexus';

export const accountState = atom<string | null | undefined>({
    key: 'anywebAccountState',
    default: null
});

export const connect = async () => {
    try {
        // await connect
        // maybe setRecoil(accountState, account)
    } catch(_) {

    }
}