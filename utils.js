'use strict';
const crypto = require('crypto')
const logger = require('./logger');

class Utility {
  isJsonStr (str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  getBool (attr) {
    if (attr && attr == 1) return true
    return false
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  safeCb(cb, params) {
    logger.debug(params)
    try {
      cb(params)
    } catch (e) {
      logger.error(e.stack)
    }
  }

  attrsDoExist (obj, attrs) {
    let exist = true;
    attrs.forEach((attr) => {
      if(!obj.hashOwnProperty(attr)) {
        exist = false;
      }
    });
    return exist;
  }

  attrsNotNull (obj, attrs) {
    let notNull = true;
    attrs.forEach((attr) => {
      if (obj[attr] == null) {
        logger.error("found null:" + attr);
        notNull = false;
      }
    });
    return notNull;
  }
  
  collectAttrs(obj, attrs) {
    let resp = {};
    attrs.forEach(attr => {
      if (obj.hasOwnProperty(attr)) {
        resp[attr] = obj[attr]
      }
    });
    return resp;
  }


/**
 *  * Return a unique identifier with the given `len`.
 *   *
 *    * @param {Number} length
 *     * @return {String}
 *      * @api private
 *       */
  getRandomDigest(raw, length) {
    let uid = '';
    let charsLength = raw.length;

    for (let i = 0; i < length; ++i) {
      uid += raw[this.getRandomInt(0, charsLength - 1)];
    }
    return uid;
  }

  getAuthCode(length) {
    let codeStr = '';
    let chars = '0123456789';
    let charsNotZero = '123456789';
    codeStr += this.getRandomDigest(charsNotZero, 1) + this.getRandomDigest(chars, length-1);
    return codeStr;
  }

  getUid(length) {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return this.getRandomDigest(chars, length);
 }

/**
 *  * Return a random int, used by `utils.getUid()`.
 *   *
 *    * @param {Number} min
 *     * @param {Number} max
 *      * @return {Number}
 *       * @api private
 *        */
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  now() {
    return (new Date()).getTime()
  }

  nowString() {
    return (new Date()).toLocaleString()
  }

  j2q(data) {
    let url = Object.keys(data).map(k => {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&');
    return url;
  }
}

function promisify(ref, f) {
  return (...args) => new Promise((resolve, reject)=> {
    const cb = (err, data) => err? reject(err): resolve(data)
    f.apply(ref, [...args, cb])
  })
}

const crypt = (key, buf, encrypt=true) => {
  const max = encrypt ? 86 : 128
  const length = buf.byteLength
  let cursor = 0
  const bufs = []
  while (length - cursor > 0) {
    let size = length - cursor
    if (encrypt) bufs.push(crypto.privateEncrypt(key, buf.slice(cursor, size > max? cursor + max: length)))
    else bufs.push(crypto.publicDecrypt(key, buf.slice(cursor, size > max? cursor + max: length)))
    cursor = cursor + max
  }
  return Buffer.concat(bufs)
}


module.exports = new Utility();
module.exports.promisify = promisify
module.exports.crypt = crypt

