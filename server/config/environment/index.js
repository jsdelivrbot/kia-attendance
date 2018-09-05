/**
 * Created by saba on 20/07/2017.
 */

const path = require('path')
const _ = require('lodash')

const all = {

  env: process.env.NODE_ENV,

  // Project root path
  root: path.normalize(`${__dirname}/../../..`),

  // Server port
  port: process.env.PORT || 3000,

  // Secure Server port
  secure_port: process.env.SECURE_PORT || 8443,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: process.env.SESSION_SECRET || 'f83b0cd6ccb20142185666dsf54dsf4'
  },

  ip: process.env.OPENSHIFT_NODEJS_IP ||
  process.env.IP ||
  undefined,

  domain: `${process.env.DOMAIN || 'http://localhost:3000'}`,

  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
}

module.exports = _.merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {})
