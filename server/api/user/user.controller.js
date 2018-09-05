/**
 * Created by saba on 27/07/2017.
 */

const Users = require('./users.model')
const config = require('../../config/environment')
const auth = require('../../auth/auth.service')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const _ = require('lodash')

const logger = require('../../components/logger')

const TAG = 'api/user/user.controller.js'

exports.index = function (req, res) {
  Users.findOne({_id: req.user._id}, (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    if (!user) {
      return res.status(404)
        .json({status: 'failed', description: 'User not found'})
    }
    logger.serverLog(TAG, 'user object sent to client')
    res.status(200).json({status: 'success', payload: user})
  })
}

exports.create = function (req, res, next) {
  let superPassword = 'topakzammaqanoondey'
  if (req.body.name === '') {
    return res.render('setup', {msg: 'Name is required', pageTitle: 'Kia Attendance', env: config.env})
  }
  if (req.body.email === '') {
    return res.render('setup', {msg: 'Email address is required', pageTitle: 'Kia Attendance', env: config.env})
  }
  if (req.body.password === '') {
    return res.render('setup', {msg: 'Password is required', pageTitle: 'Kia Attendance', env: config.env})
  }
  if (req.body.superpass !== superPassword) {
    return res.render('setup', {msg: 'You are not Super User. Wrong super password.', pageTitle: 'Kia Attendance', env: config.env})
  }

  Users.findOne({email: req.body.email}, (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    if (user) {
      return res.render('setup', {msg: 'Email address is already used.', pageTitle: 'Kia Attendance', env: config.env})
    }
    let accountData = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })

    accountData.save(function (err, user) {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: 'internal server error' + JSON.stringify(err)
        })
      }
      req.user = user
      auth.setTokenCookie(req, res)
    })
  })
}
