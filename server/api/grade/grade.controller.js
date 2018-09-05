/**
 * Created by saba on 27/07/2017.
 */

 const Department = require('./../department/department.model')
 const Designation = require('./../designation/designation.model')
 const Grade = require('./../grade/grade.model')
 const config = require('../../config/environment')
 const auth = require('../../auth/auth.service')
 const jwt = require('jsonwebtoken')
 const crypto = require('crypto')
 const _ = require('lodash')

 const logger = require('../../components/logger')

 const TAG = 'api/user/grade.controller.js'

 exports.index = function (req, res) {
   Grade.findOne({_id: req.user._id}, (err, grade) => {
     if (err) {
       return res.status(500).json({
         status: 'failed',
         description: 'internal server error' + JSON.stringify(err)
       })
     }
     if (!grade) {
       return res.status(404)
         .json({status: 'failed', description: 'grade not found'})
     }
     logger.serverLog(TAG, 'grade object sent to client')
     res.status(200).json({status: 'success', payload: grade})
   })
 }

 exports.create = function (req, res, next) {
   logger.serverLog(TAG, JSON.stringify(req.body))
   Grade.find({}, (err, grade) => {
     if (err) {
       return res.status(500).json({
         status: 'failed',
         description: 'internal server error' + JSON.stringify(err)
       })
     }
     if (req.body.gradeId === '') {
       return res.render('grade', {grade, msg: 'grade id is required', pageTitle: 'Kia Attendance', env: config.env})
     }
     if (req.body.gradeName === '') {
       return res.render('grade', {grade, msg: 'grade name is required', pageTitle: 'Kia Attendance', env: config.env})
     }

     Grade.findOne({gradeId: req.body.gradeId}, (err, user) => {
       if (err) {
         return res.status(500).json({
           status: 'failed',
           description: 'internal server error' + JSON.stringify(err)
         })
       }
       if (user) {
         return res.render('grade', {grade, msg: 'grade is already created.', pageTitle: 'Kia Attendance', env: config.env})
       }
       let accountData = new Grade({
         gradeId: req.body.gradeId,
         gradeName: req.body.gradeName
       })

       accountData.save(function (err, user) {
         if (err) {
           return res.status(500).json({
             status: 'failed',
             description: 'internal server error' + JSON.stringify(err)
           })
         }
         res.render('grade', {grade, msg: 'Grade is created successfully.', pageTitle: 'Kia Attendance', env: config.env})
       })
     })
   })
 }
