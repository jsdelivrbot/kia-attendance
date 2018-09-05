/**
 * Created by saba on 20/07/2017.
 */

/**
 * Main application routes
 */

'use strict'

const path = require('path')
const config = require('./config/environment/index')
const viewControllers = require('./viewControllers/index')
const auth = require('./auth/auth.service')
const csv = require('csv-parser')

const logger = require('./components/logger')
const TAG = 'routes.js'

module.exports = function (app) {
  app.use('/api/users', require('./api/user'))
  app.use('/api/designation', require('./api/designation'))
  app.use('/api/department', require('./api/department'))
  app.use('/api/employee', require('./api/employee'))
  app.use('/api/grade', require('./api/grade'))
  app.use('/api/location', require('./api/location'))
  app.use('/api/attendencepolicy', require('./api/attendencepolicy'))
  app.use('/api/attendance', require('./api/attendance'))
  app.use('/auth', require('./auth'))

  app.get('/', auth.redirectBasedOnAuth(), viewControllers.index)
  app.get('/attendanceReport', auth.redirectBasedOnAuth(), viewControllers.attendanceReport)
  app.get('/customReport', auth.redirectBasedOnAuth(), viewControllers.customReport)
  app.get('/createEmployee', auth.redirectBasedOnAuth(), viewControllers.createEmployee)
  app.get('/createDepartment', auth.redirectBasedOnAuth(), viewControllers.createDepartment)
  app.get('/createDesignation', auth.redirectBasedOnAuth(), viewControllers.createDesignation)
  app.get('/createGrade', auth.redirectBasedOnAuth(), viewControllers.createGrade)
  app.get('/createLocation', auth.redirectBasedOnAuth(), viewControllers.createLocation)
  app.get('/createAttendencepolicy', auth.redirectBasedOnAuth(), viewControllers.createAttendencepolicy)
  app.get('/login', viewControllers.login)
  app.get('/setup', viewControllers.setup)

  app.post('/uploadFile', viewControllers.uploadFile)

  app.route('/:url(api|auth)/*')
    .get((req, res) => {
      res.status(404).send({url: `${req.originalUrl} not found`})
    })
    .post((req, res) => {
      res.status(404).send({url: `${req.originalUrl} not found`})
    })

  app.route('/*')
    .get((req, res) => {
      res.render('404')
    })
    .post((req, res) => {
      res.redirect('/')
    })

  if (config.env === 'production' || config.env === 'staging') {
    app.use(function (err, req, res, next) {
      console.error(err.stack)
      logger.serverLog(TAG, '==========FATAL CRASH==========')
      logger.serverLog(TAG, err.stack)
      logger.serverLog(TAG, err.message)
      if (err.message === 'jwt expired') {
        res.clearCookie('token')
        return res.redirect('/')
      }
      res.status(500).send('Something broke! Please go to home page')
      /**
       * Further logic for error handling.
       * You may integrate with Crash reporting tool like Raven.
       */
    })
  }
}
