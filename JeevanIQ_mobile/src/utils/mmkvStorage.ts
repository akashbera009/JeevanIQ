import { createMMKV } from "react-native-mmkv";
import { STORAGE_KEYS } from './constants';
import { TokenPair, User } from './types';

export const mmkv = createMMKV({
  id: "dwwp-storage"
});
// Storage adapter for redux-persist
export const mmkvStorage = {
  setItem: (key: string, value: string): Promise<void> => {
    return new Promise(resolve => {
      mmkv.set(key, value);
      resolve();
    });
  },

  getItem: (key: string): Promise<string | null> => {
    return new Promise(resolve => {
      const value = mmkv.getString(key);
      resolve(value || null);
    });
  },

  removeItem: (key: string): Promise<void> => {
    return new Promise(resolve => {
      mmkv.remove(key);
      resolve();
    });
  },

};


// ─── Token Management ─────────────────────────────────────────────────────────
 
export const saveTokens = (tokens: TokenPair): void => {
  mmkvStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access);
  mmkvStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh);
};
 
export const getAccessToken = async(): Promise<string | undefined> => {
  return await mmkvStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN ) ?? '';
};
 
export const getRefreshToken = async(): Promise<string | undefined> => {
  return await mmkvStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN ) ?? '';
};
 
export const clearTokens = (): void => {
  mmkvStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  mmkvStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const clearUser = (): void => {
  mmkvStorage.removeItem(STORAGE_KEYS.USER);
};

export const saveUser = (user: User): void => {
  mmkvStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const user = await mmkvStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};
 
export const clearAll = async (): Promise<void> => {
  mmkv.clearAll();
};

export default mmkvStorage;