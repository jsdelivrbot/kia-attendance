/**
 * Created by saba on 24/07/2017.
 */
'use strict'

const config = require('../config/environment')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const compose = require('composable-middleware')
const Users = require('../api/user/users.model')
const validateJwt = expressJwt({secret: config.secrets.session})

const logger = require('../components/logger')

const TAG = 'auth/auth.service.js'

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated () {
  return compose()
  // Validate jwt or api keys
    .use((req, res, next) => {
      let token = req.cookies.token
      if (token) {
        req.headers.authorization = `Bearer ${token}`
        validateJwt(req, res, next)
      } else {
        // allow access_token to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = `Bearer ${req.query.access_token}`
        }
        validateJwt(req, res, next)
      }
    })
    // Attach user to request
    .use((req, res, next) => {
      Users.findById(req.user._id, function (err, user) {
        if (err) return next(err)
        if (!user) return res.send(401)

        req.user = user
        next()
      })
    })
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function isAuthorizedSuperUser () {
  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements (req, res, next) {
      if (req.user.isSuperUser) {
        next()
      } else {
        res.send(403)
      }
    })
}

function redirectBasedOnAuth () {
  return compose()
  // Validate jwt or api keys
    .use((req, res, next) => {
      let token = req.cookies.token
      if (token) {
        req.headers.authorization = `Bearer ${token}`
        validateJwt(req, res, next)
      } else {
        res.redirect('/login')
      }
    })
    // Attach user to request
    .use((req, res, next) => {
      if (req.user) {
        Users.findById(req.user._id, (err, user) => {
          if (err) {
            return res.status(500)
            .json({status: 'failed', description: 'Internal Server Error'})
          }
          if (!user) {
            res.clearCookie('token')
            return next()
          }
          req.user = user
          next()
        })
      } else {
        res.redirect('/login')
      }
    })
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken (id) {
  return jwt.sign({_id: id}, config.secrets.session,
    {expiresIn: 60 * 60 * 24 * 4})
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie (req, res) {
  if (!req.user) {
    return res.status(404).json({
      status: 'failed',
      description: 'Something went wrong, please try again.'
    })
  }
  const token = signToken(req.user._id)
  logger.serverLog(TAG, `Signed token for ${req.user.name}`)
  res.cookie('token', token)
  res.redirect('/')
}

function logout (req, res) {
  res.clearCookie('token')
  res.redirect('/login')
}

exports.isAuthenticated = isAuthenticated
exports.signToken = signToken
exports.setTokenCookie = setTokenCookie
exports.isAuthorizedSuperUser = isAuthorizedSuperUser
exports.redirectBasedOnAuth = redirectBasedOnAuth
exports.logout = logout
