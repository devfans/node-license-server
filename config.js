'use strict'

const path = require('path')

module.exports = {
  name: 'node-license-server',
  identity: 'ClientSoftware',     // client software identity
  stateless: false,
  redis: 'redis://redis:6379',
  expireAfter: 365*24*60*60*1000,
  rsa_private_key: path.join(__dirname, "sample.private.pem"),
  rsa_public_key: path.join(__dirname, "sample.public.pem"),
  rsa_passphrase: "1234"
}
