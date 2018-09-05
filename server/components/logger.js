/**
 * Created by saba on 20/07/2017.
 */

const config = require('../config/environment/index')

const winston = require('winston')

// eslint-disable-next-line no-unused-expressions
require('winston-papertrail').Papertrail

// const logger = new winston.Logger({
//   transports: [
//     // new (winston.transports.Console)(),
//   ]
// })

exports.serverLog = function (label, data) {
  const namespace = `kia-attendance:${label}`
  const debug = require('debug')(namespace)

  if (config.env === 'development' || config.env === 'test') {
    console.log(namespace + ': ' + data)
    debug(data)
  } else {
    // logger.info(`${namespace} - ${data}`)
  }
}

exports.clientLog = function (label, data) {
  const namespace = `kia-attendance:client:${label}`
  const debug = require('debug')(namespace)

  if (config.env === 'development' || config.env === 'staging') {
    debug(data)
  } else {
    // logger.info(`${namespace} - ${data}`)
  }
}
