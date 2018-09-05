/**
 * Created by saba on 03/08/2017.
 */

const http = require('http')
const https = require('https')
const fs = require('fs')
const logger = require('./../components/logger')

const TAG = 'config/setup.js'

module.exports = function (app, httpapp, config) {
  let options = {
    ca: '',
    key: '',
    cert: ''
  }

  if (config.env === 'production') {
    try {
      options = {
        ca: fs.readFileSync('/root/certs/ca_bundle.crt'),
        key: fs.readFileSync('/root/certs/electionwar.key'),
        cert: fs.readFileSync('/root/certs/electionwar.crt')
      }
    } catch (e) {

    }
  }

  const server = http.createServer(httpapp)
  const httpsServer = https.createServer(options, app)

  if (config.env === 'production' || config.env === 'staging') {
    httpapp.get('*', (req, res) => {
      res.redirect(`${config.domain}${req.url}`)
    })
  }

  server.listen(config.port, config.ip, () => {
    logger.serverLog(TAG, `Kia Attendance server STARTED on ${
      config.port} in ${config.env} mode`)
  })

  httpsServer.listen(config.secure_port, () => {
    logger.serverLog(TAG, `Kia Attendance server STARTED on ${
      config.secure_port} in ${config.env} mode`)
  })
}
