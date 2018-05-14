'use strict'
module.exports = {
  name: 'node-license-server',
  identity: 'ClientSoftware',     // client software identity
  stateless: false,
  redis: 'redis://office.pixelmatic.com.cn:9736',
  rsa_private_key: "private.pem",
  rsa_public_key: "public.pem",
  rsa_passphrase: "1234"
}
