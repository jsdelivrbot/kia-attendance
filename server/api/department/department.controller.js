/**
 * Created by saba on 27/07/2017.
 */

 const Department = require('./department.model')
 const Designation = require('./../designation/designation.model')
 const config = require('../../config/environment')
 const auth = require('../../auth/auth.service')
 const jwt = require('jsonwebtoken')
 const crypto = require('crypto')
 const _ = require('lodash')

 const logger = require('../../components/logger')

 const TAG = 'api/user/department.controller.js'

 exports.index = function (req, res) {
   Department.findOne({_id: req.user._id}, (err, department) => {
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
   logger.serverLog(TAG, JSON.stringify(req.body))
   Department.find({}, (err, designations) => {
     if (err) {
       return res.status(500).json({
         status: 'failed',
         description: 'internal server error' + JSON.stringify(err)
       })
     }
     if (req.body.departmentID === '') {
       return res.render('department', {designations, msg: 'Department id is required', pageTitle: 'Kia Attendance', env: config.env})
     }
     if (req.body.departmentName === '') {
       return res.render('department', {designations, msg: 'Department name is required', pageTitle: 'Kia Attendance', env: config.env})
     }

     Department.findOne({departmentID: req.body.departmentID}, (err, user) => {
       if (err) {
         return res.status(500).json({
           status: 'failed',
           description: 'internal server error' + JSON.stringify(err)
         })
       }
       if (user) {
         return res.render('department', {designations, msg: 'Deparment is already created.', pageTitle: 'Kia Attendance', env: config.env})
       }
       let accountData = new Department({
         departmentID: req.body.departmentID,
         departmentName: req.body.departmentName
       })

       accountData.save(function (err, user) {
         if (err) {
           return res.status(500).json({
             status: 'failed',
             description: 'internal server error' + JSON.stringify(err)
           })
         }
         res.render('department', {designations, msg: 'Department is created successfully.', pageTitle: 'Kia Attendance', env: config.env})
       })
     })
   })
 }
