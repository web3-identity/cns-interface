import { type AtomEffect } from 'recoil';
import LocalStorage from 'localstorage-enhance';

export const persistAtom: AtomEffect<any> = ({ setSelf, onSet, node: { key } }) => {
  setSelf(LocalStorage.getItem(key));

  onSet((data) => {
    LocalStorage.setItem({ key, data });
  });
};

export const persistAtomWithDefault = (defaultValue: any): AtomEffect<any> => ({ setSelf, onSet, node: { key } }) => {
  setSelf(LocalStorage.getItem(key) ?? defaultValue);

  onSet((data) => {
    LocalStorage.setItem({ key, data });
  });
};

export const persistAsynAtom =
  (fetcher: () => Promise<any>): AtomEffect<any> =>
  ({ setSelf, trigger, node: { key } }) => {
    if (trigger === 'get') {
      const storageData = LocalStorage.getItem(key) as number;
      if (storageData !== null) {
        setSelf(storageData);
      } else
        setSelf(
          fetcher().then((data) => {
            LocalStorage.setItem({ key, data });
            return data;
          })
        );
    }
  };
