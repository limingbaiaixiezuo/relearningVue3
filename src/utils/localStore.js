class LocalStore {
  set(key, value) {
    localStorage.setItem(key, value);
  }

  get(key) {
    return localStorage.getItem(key);
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}

export function createLocalStore() {
  if (LocalStore.instance) return LocalStore.instance;
  return (LocalStore.instance = new LocalStore());
}

export function useLocalStore() {
  return createLocalStore();
}
