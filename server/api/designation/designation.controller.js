/**
 * Created by saba on 27/07/2017.
 */

const Designation = require('./designation.model')
const config = require('../../config/environment')
const auth = require('../../auth/auth.service')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const _ = require('lodash')

const logger = require('../../components/logger')

const TAG = 'api/user/wmployee.controller.js'

exports.index = function (req, res) {
  Designation.findOne({_id: req.body._id}, (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    if (!department) {
      return res.status(404)
        .json({status: 'failed', description: 'department not found'})
    }
    logger.serverLog(TAG, 'department object sent to client')
    res.status(200).json({status: 'success', payload: department})
  })
}

exports.create = function (req, res, next) {
  if (req.body.designationID === '') {
    return res.render('designation', {msg: 'Designation Id is required', pageTitle: 'Kia Attendance', env: config.env})
  }
  if (req.body.designationname === '') {
    return res.render('designation', {msg: 'Designation name is required', pageTitle: 'Kia Attendance', env: config.env})
  }

  Designation.findOne({designationId: req.body.designationID}, (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    if (user) {
      return res.render('designation', {msg: 'Designation is already created. Cannot create duplicate.', pageTitle: 'Kia Attendance', env: config.env})
    }
    let accountData = new Designation({
      designationId: req.body.designationID,
      designationName: req.body.designationname

    })

    accountData.save(function (err, user) {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: 'internal server error' + JSON.stringify(err)
        })
      }
      res.render('designation', {msg: 'Designation is created successfully.', pageTitle: 'Kia Attendance', env: config.env})
    })
  })
}
