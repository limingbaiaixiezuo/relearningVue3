import other from '@/icons/const/other.svg';
import image from '@/icons/const/image.svg';
import ppt from '@/icons/const/ppt.svg';
import excel from '@/icons/const/excel.svg';
import pdf from '@/icons/const/pdf.svg';
import word from '@/icons/const/word.svg';
import zip from '@/icons/const/zip.svg';
import cad from '@/icons/const/cad.svg';
import { isDefine } from './validate';
const pdfType = ['pdf'];
const excelType = ['xls', 'xlsx'];
const docType = ['doc', 'docs', 'docx'];
const zipType = ['zip', 'rar', 'z', 'lzh', 'jar'];
const cadType = ['dwg', 'cad', 'dxf', 'dws', 'dwt'];
const pptType = ['ppt', 'pps', 'pptx', 'ppsx', 'pot', 'ppa'];
const imageType = ['jfif', 'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'tiff', 'image'];

export const isType = (arr, string) => {
  if (string === undefined || string === null) return false;
  return arr.includes(string.toLowerCase());
};
export function isImageExtension(extension) {
  return isType(imageType, extension);
}

export function getIconByUrlExtension(url, extension) {
  if (isImageExtension(extension)) return url;

  return getIconByExtension(extension);
}

export function getIconByExtension(extension) {
  // 图片类型
  if (isType(imageType, extension)) return image;

  // ppt类型
  if (isType(pptType, extension)) return ppt;

  // excel类型
  if (isType(excelType, extension)) return excel;

  // pdf类型
  if (isType(pdfType, extension)) return pdf;

  // 文档类型
  if (isType(docType, extension)) return word;

  // 压缩包类型
  if (isType(zipType, extension)) return zip;

  // cad类型
  if (isType(cadType, extension)) return cad;

  // 默认返回图标
  return other;
}

export function getExtensionByName(name) {
  const arr = /\.(\w*)$/.exec(name);
  if (isDefine(arr) && arr.length) {
    return arr;
  } else {
    return ['null', 'other'];
  }
}

export function getIconSrcByFileName(fileName) {
  let [, extension] = getExtensionByName(fileName);
  extension = extension.toLowerCase();
  return getIconByExtension(extension);
}

// 下载图片
export function downloadImage(imgsrc, name) {
  const image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous');
  image.onload = function() {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);
    const url = canvas.toDataURL('image/png'); // 得到图片的base64编码数据
    const a = document.createElement('a'); // 生成一个a元素
    const event = new MouseEvent('click'); // 创建一个单击事件
    a.download = name || 'photo'; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  // 将资源链接赋值过去，才能触发image.onload 事件
  image.src = imgsrc;
}

// 下载除图片的文件
export function downLoadAll(fileName, url) {
  console.log(url);
  var x = new XMLHttpRequest();
  x.open('GET', url, true);
  x.responseType = 'blob';
  x.onload = function() {
    var blob = x.response;
    if ('msSaveOrOpenBlob' in navigator) {
      // IE导出
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      var a = document.createElement('a');
      a.download = fileName;
      a.href = URL.createObjectURL(blob);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  x.send();
}

/**
 * @author pei
 * @description 读取csv文件数据，返回json
 * @param {*} file
 */
export function readCsvFile(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    const fileReaderJson = [];
    reader.readAsText(file, 'gbk');
    reader.onload = function() {
      var allRows = csvToArray(reader.result);
      allRows.forEach((csvRowValues, rowIndex) => {
        if (
          rowIndex === allRows.length - 1 &&
          csvRowValues.length === 1 &&
          !csvRowValues[0]
        ) {
          // 尾行无内容
          return;
        }
        const rowValueArr = [];
        csvRowValues.forEach((cellValue, cellIndex) => {
          rowValueArr[cellIndex] = cellValue;
        });
        fileReaderJson.push(rowValueArr);
      });
      resolve(fileReaderJson);
    };
  });
}

export function csvToArray(text) {
  let p = '';
  let row = [''];
  const ret = [row];
  let i = 0;
  let r = 0;
  let s = !0;
  let l;
  for (l of text) {
    if (l === '"') {
      if (s && l === p) row[i] += l;
      s = !s;
    } else if (l === ',' && s) l = row[++i] = '';
    else if (l === '\n' && s) {
      if (p === '\r') row[i] = row[i].slice(0, -1);
      row = ret[++r] = [(l = '')];
      i = 0;
    } else row[i] += l;
    p = l;
  }
  return ret;
}

export function parseImgInDomToFile (arg) {
  var objE = document.createElement('div');
  objE.innerHTML = arg;
  if (objE.children[0].src) {
    const url = objE.children[0].src;
    const imageName = 'image.png';
    return new Promise((resolve, reject) => {
      var blob = null;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.setRequestHeader('Accept', 'image/jpeg');
      xhr.responseType = 'blob';
      xhr.onload = () => {
        blob = xhr.response;
        const imgFile = new File([blob], imageName, {
          type: 'image/jpeg'
        });
        resolve(imgFile);
      };
      xhr.onerror = (e) => {
        reject(e);
      };
      xhr.send();
    });
  }
}
