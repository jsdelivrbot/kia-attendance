/**
 * Created by saba on 27/07/2017.
 */

 const Department = require('./../department/department.model')
 const Designation = require('./../designation/designation.model')
 const Grade = require('./../grade/grade.model')
 const Location = require('./../location/location.model')
 const Attendencepolicy = require('./attendencepolicy.model')
 const config = require('../../config/environment')
 const auth = require('../../auth/auth.service')
 const jwt = require('jsonwebtoken')
 const crypto = require('crypto')
 const _ = require('lodash')

 const logger = require('../../components/logger')

 const TAG = 'api/user/attendencepolicy.controller.js'

 exports.index = function (req, res) {
   Attendencepolicy.findOne({_id: req.user._id}, (err, attendencepolicy) => {
     if (err) {
       return res.status(500).json({
         status: 'failed',
         description: 'internal server error' + JSON.stringify(err)
       })
     }
     if (!attendencepolicy) {
       return res.status(404)
         .json({status: 'failed', description: 'attendencepolicy not found'})
     }
     logger.serverLog(TAG, 'attendencepolicy object sent to client')
     res.status(200).json({status: 'success', payload: attendencepolicy})
   })
 }

 exports.create = function (req, res, next) {
   logger.serverLog(TAG, JSON.stringify(req.body))
   Attendencepolicy.find({}, (err, attendencepolicy) => {
     if (err) {
       return res.status(500).json({
         status: 'failed',
         description: 'internal server error' + JSON.stringify(err)
       })
     }
     if (req.body.attendencepolicyId === '') {
       return res.render('attendencepolicy', {attendencepolicy, msg: 'attendencepolicy id is required', pageTitle: 'Kia Attendance', env: config.env})
     }
     if (req.body.attendencepolicyDescription === '') {
       return res.render('attendencepolicy', {attendencepolicy, msg: 'attendencepolicyDescription is required', pageTitle: 'Kia Attendance', env: config.env})
     }
     if (req.body.timeFrom === '') {
       return res.render('timeFrom', {attendencepolicy, msg: 'timeFrom is required', pageTitle: 'Kia Attendance', env: config.env})
     }
     if (req.body.timeTo === '') {
       return res.render('timeTo', {attendencepolicy, msg: 'timeTo is required', pageTitle: 'Kia Attendance', env: config.env})
     }

     Attendencepolicy.findOne({attendencepolicyId: req.body.attendencepolicyId}, (err, user) => {
       if (err) {
         return res.status(500).json({
           status: 'failed',
           description: 'internal server error' + JSON.stringify(err)
         })
       }
       if (user) {
         return res.render('attendencepolicy', {attendencepolicy, msg: 'Attendencepolicy is already created.', pageTitle: 'Kia Attendance', env: config.env})
       }
       let accountData = new Attendencepolicy({
         attendencepolicyId: req.body.attendencepolicyId,
         attendencepolicyDescription: req.body.attendencepolicyDescription,
         timeFrom: req.body.timeFrom,
         timeTo: req.body.timeTo
       })

       accountData.save(function (err, user) {
         if (err) {
           return res.status(500).json({
             status: 'failed',
             description: 'internal server error' + JSON.stringify(err)
           })
         }
         res.render('attendencepolicy', {attendencepolicy, msg: 'Attendencepolicy is created successfully.', pageTitle: 'Kia Attendance', env: config.env})
       })
     })
   })
 }
