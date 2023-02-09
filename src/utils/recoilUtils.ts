import { atom, type AtomEffect, type MutableSnapshot } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import LocalStorage from 'localstorage-enhance';
export { type MutableSnapshot } from 'recoil';

export const persistAtom: AtomEffect<any> = ({ setSelf, onSet, trigger, node: { key } }) => {
  if (trigger === 'get') {
    setSelf(LocalStorage.getItem(key));
  }

  onSet((data) => {
    LocalStorage.setItem({ key, data });
  });
};

export const persistAtomWithNamespace =
  (namespace: string): AtomEffect<any> =>
  ({ setSelf, onSet, trigger, node: { key } }) => {
    if (trigger === 'get') {
      setSelf(LocalStorage.getItem(key, namespace));
    }

    onSet((data) => {
      LocalStorage.setItem({ key, data, namespace });
    });
  };

export const persistAtomWithDefault =
  (defaultValue: any): AtomEffect<any> =>
  ({ setSelf, onSet, node: { key } }) => {
    setSelf(LocalStorage.getItem(key) ?? defaultValue);

    onSet((data) => {
      LocalStorage.setItem({ key, data });
    });
  };

let initCallback: Array<(set: MutableSnapshot['set']) => void> | null = [];
export const handleRecoilInit = (callback: (set: MutableSnapshot['set']) => void) => {
  if (!initCallback) throw new Error('Recoil init callback has been called');
  initCallback.push(callback);
};

export const initializeRecoil = (snapshot: MutableSnapshot) => {
  if (initCallback) {
    initCallback.forEach((callback) => callback?.(snapshot.set));
    initCallback = null;
  }
}
