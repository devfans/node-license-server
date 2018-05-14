'use strict'
const config = require('../config')
const md = require('machine-digest')
const fetch = require('node-fetch')
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const logger = require('../logger')
const utils = require('../utils')

md.secret = "client software"

const licenseServer = "http://localhost:3000/v1/license"


const PublicKey = fs.readFileSync(path.join(__dirname, config.rsa_public_key)).toString()
const checkLicense = async () => {
  logger.info('verifying license')
  let status = false

  while (!status) {
    try {
      status = await _checkLicense()
    } catch (e) {
      logger.error(e.toString()) 
      logger.error("Failed to verfiy software license, please check your license key and license file")
      process.exit(1)
    }
  }
}

const _checkLicense = async () => {
  
  // load licenseKey from somewhere
  const licenseKey = fs.readFileSync('key.txt').toString().replace('\n', '')

  // get machine id
  const machineId = md.get().digest

  // load license from somewhere
  let _license
  try {
    _license = fs.readFileSync('license.txt').toString().replace('\n', '')
  } catch (e) {
    logger.warn('Failed to load license file, fetching from license server')
    const params = { method: 'POST', body: JSON.stringify({id: machineId, key: licenseKey}),
                     headers: { 'Content-Type': 'application/json' } }
    logger.info(params)
    const res = await fetch(licenseServer, params)
    const resData = await res.json()
    logger.info(resData)
    if (resData.status !== 0) {
      throw Error('Failed to get license from server!, error code: ' + resData.status)
    }
    _license = resData.license
    fs.writeFileSync('license.txt', resData.license, 'utf8')
  }
  const buf = Buffer.from(_license, 'hex')
  const license = JSON.parse(utils.crypt(PublicKey, buf, false).toString())
  logger.debug(license)
  if (license.key === licenseKey && license.machine === machineId && license.identity === config.identity) {
    if (license.meta.persist || (license.meta.startDate < Date.now() && license.meta.endDate > Date.now())) {
      return true
    } else throw Error('invalid effect date of license')
  } else throw Error('invalid license')
}

const start = async () => {
  await checkLicense()
  logger.info('Verified license successfully, ready to start now...')
}

start()

