/**
 * Created by saba on 03/08/2017.
 */

const http = require('http')
const logger = require('./../components/logger')

const TAG = 'config/setup.js'

module.exports = function (app, config) {
  const server = http.createServer(app)

  server.listen(config.port, config.ip, () => {
    logger.serverLog(TAG, `Kia Attendance server STARTED on ${
      config.port} in ${config.env} mode`)
  })
}
