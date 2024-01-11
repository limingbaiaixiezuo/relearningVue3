
import Cookies from 'js-cookie';

export class CookieStore {
  constructor() {
    this.TokenKey = 'Token';
  }

  get(key, parse = true) {
    const data = Cookies.getItem(key);
    return parse ? JSON.parse(data) : data;
  }

  set(key, value, stringify = true) {
    const data = stringify ? JSON.stringify(value) : value;
    return Cookies.set(key, data);
  }

  remove(key) {
    return Cookies.removeItem(key);
  }

  getToken() {
    return Cookies.get(this.TokenKey);
  }

  setToken(token) {
    return Cookies.set(this.TokenKey, token);
  }

  removeToken() {
    return Cookies.remove(this.TokenKey);
  }
}
