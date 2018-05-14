# node-license-server
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

client software licensing server

## Get Started
```
git clone https://github.com/devfans/node-license-server.git
cd node-license-server
node index.js

```

## Licensing logic

The licensing server will generate client software license to permit client software to run when software user trys to run it at the first time, and the license can be saved locally to be reused for the bound machine. The main flow should be like:

1. License server add a batch of license keys into the database, the keys can be encrypted strings by server RSA private key which will contains the informations including expiration time. 
2. Software holder issue license keys to software users.
3. Client software should generate a unique ID of the client machine to identify the unique hardware, which can be achived using modules like `machine-digest`, and post the key and machine uuid to license server.
4. License server bind the key with the machine uuid, and generate a license file with RSA private key.
5. Client software save the license file locally and verify license with server's RSA public key. Client software can also set a daily timer to check the expiration of the key.

## Generate RSA Keys

```
openssl genrsa -des3 -out private.pem 1024
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```
  
[npm-image]: https://img.shields.io/npm/v/node-license-server.svg
[npm-url]: https://npmjs.org/package/node-license-server
[travis-image]: https://img.shields.io/travis/devfans/node-license-server/master.svg
[travis-url]: https://travis-ci.org/devfans/node-license-server
[coveralls-image]: https://img.shields.io/coveralls/devfans/node-license-server/master.svg
[coveralls-url]: https://coveralls.io/r/devfans/node-license-server?branch=master
[downloads-image]: https://img.shields.io/npm/dm/node-license-server.svg
[downloads-url]: https://npmjs.org/package/node-license-server

