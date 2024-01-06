// 加密方法
import CryptoJS from 'crypto-js';

export function passwordEncrypt(password) {
  const { enc, AES, mode, pad } = CryptoJS;
  const secretKey = import.meta.env.VITE_APP_PASSWORD_KEY;
  const key = enc.Latin1.parse(secretKey);

  return AES.encrypt(password, key, {
    iv: key,
    mode: mode.CBC,
    padding: pad.Pkcs7
  }).toString();
}

export function calculateSHA256Hash(content) {
  return CryptoJS.SHA256(content).toString();
}

export function calculateSHA1Hash(content) {
  return CryptoJS.SHA1(content).toString();
}
