import { isDefine } from './validate';
import { Base64 } from 'js-base64';

import pako from 'pako';

export function gzip(data) {
  if (!isDefine(data)) {
    return null;
  }
  const dataJson = typeof data === 'object' ? JSON.stringify(data) : data;

  const textEncoder = new TextEncoder('utf-8');
  const encodedData = textEncoder.encode(dataJson);
  const binaryString = pako.gzip(encodedData, {to: 'string'});
  return Base64.fromUint8Array(binaryString);
}

export function ungzip(b64Data) {
  if (!isDefine(b64Data)) {
    return null;
  }
  const compressedUint8Array = Base64.toUint8Array(b64Data);
  // 解压
  var data = pako.inflate(compressedUint8Array);
  // 将解压缩完成的的byteArray转换回ascii字符串:
  // 大数据使用此方法
  const result = new TextDecoder('utf-8').decode(data);
  // var strData   = String.fromCharCode.apply(null, new Uint16Array(data));//数据不是很多可以使用此方法
  try {
    return JSON.parse(result);
  } catch (error) {}
  return result;
}
