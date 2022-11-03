import { type AtomEffect } from 'recoil';
import LocalStorage from 'localstorage-enhance';

export const persistAtom: AtomEffect<any> = ({ setSelf, onSet, trigger, node: { key } }) => {
  if (trigger === 'get') {
    setSelf(LocalStorage.getItem(key));
  }

  onSet((data) => {
    LocalStorage.setItem({ key, data });
  });
};

export const persistAtomWithNamespace = (namespace: string): AtomEffect<any> => ({ setSelf, onSet, trigger, node: { key } }) => {
  if (trigger === 'get') {
    setSelf(LocalStorage.getItem(key, namespace));
  }

  onSet((data) => {
    LocalStorage.setItem({ key, data, namespace });
  });
};

export const persistAtomWithDefault = (defaultValue: any): AtomEffect<any> => ({ setSelf, onSet, node: { key } }) => {
  setSelf(LocalStorage.getItem(key) ?? defaultValue);

  onSet((data) => {
    LocalStorage.setItem({ key, data });
  });
};