process.env.NO_DEPRECATION = 'node-license-server';

var after = require('after')
var assert = require('assert')
var config = require('../config')
var fs = require('fs')
var utils = require('../utils')

var PrivateKey = {
  key: fs.readFileSync(path.join(__dirname, '../', config.rsa_private_key)).toString(),
  passphrase: config.rsa_passphrase
}

var PublicKey = fs.readFileSync(path.join(__dirname, '../', config.rsa_public_key)).toString()


describe('node-license-server', function(){
  it('get function', function(){
  })

  it('should success', function() {
    var message = " message "
    var buf = Buffer.from(message, 'utf8')
    var data = utils.crypt(PrivateKey, buf, true).toString('hex')
    var buf_rev = Buffer.from(data, 'hex') 
    var message_rev = utils.crypt(PublicKey, buf_rev, false).toString('utf8')
    assert.equal(message, message_rev)
  })
})
