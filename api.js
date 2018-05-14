'use strict'
const express = require('express')
const router = express.Router()
const config = require('./config')
const utils = require('./utils')
const model = require('./model')
const logger = require('./logger')
const errors = require('./errors')

class Handler {
  async handleLicense(req, res) {
    if (!utils.attrsNotNull(req.body, ['key', 'id'])) return res.json({status: errors.BAD_REQUEST})
    const {key, id:machine} = req.body
    const data = model.LicenseKey.validate(key)
    if (!data) return res.json({status: errors.INVALID_INPUT})

    if (!config.stateless) {
      const licenseKey = await model.LicenseKey.fetch(key)
      if (!licenseKey || licenseKey.revoked == 1) {
        logger.error(`Failed to check the license key in databaes: ${key}`)
        return res.json({status: errors.NULL_DATA})
      }
      
      let success = await model.LicenseKey.authorize(key, machine)
      if (licenseKey.machine === machine) success = true
      if (!success) {
        logger.error(`Used key encountered: ${key}, ${machine}`)
        return res.json({status: errors.DUPLICATE_DATA})
      }
    }
    const license = model.LicenseKey.generateLicense(key, machine)
    return res.json({status: errors.SUCCESS, license})
  }

  issue(options={}) {
    return model.LicenseKey.issue(options)
  }

  revoke(key) {
    return model.LicenseKey.revoke(key)
  }
}

const handler = new Handler

router.post('/license', handler.handleLicense.bind(handler))

module.exports = { router, handler }
