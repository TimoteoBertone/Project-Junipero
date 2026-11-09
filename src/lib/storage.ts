import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Thin wrapper so storage failures (e.g. native module unavailable)
 * never crash the app with unhandled promise rejections.
 */
export const appStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn("[storage] getItem failed", key, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.warn("[storage] setItem failed", key, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn("[storage] removeItem failed", key, error);
    }
  },
};
