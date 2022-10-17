import { AtomEffect } from 'recoil';
import LocalStorage from 'localstorage-enhance';

export const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }) => {
    setSelf(LocalStorage.getItem(key));

    onSet((data) => {
      LocalStorage.setItem({ key, data });
    });
  };
