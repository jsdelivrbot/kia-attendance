/**
 * Created by saba on 27/07/2017.
 */

 const Department = require('./../department/department.model')
 const Designation = require('./../designation/designation.model')
 const Grade = require('./../grade/grade.model')
 const Location = require('./location.model')
 const config = require('../../config/environment')
 const auth = require('../../auth/auth.service')
 const jwt = require('jsonwebtoken')
 const crypto = require('crypto')
 const _ = require('lodash')

 const logger = require('../../components/logger')

 const TAG = 'api/user/location.controller.js'

 exports.index = function (req, res) {
   Location.findOne({_id: req.user._id}, (err, location) => {
     if (err) {
       return res.status(500).json({
         status: 'failed',
         description: 'internal server error' + JSON.stringify(err)
       })
     }
     if (!location) {
       return res.status(404)
         .json({status: 'failed', description: 'location not found'})
     }
     logger.serverLog(TAG, 'location object sent to client')
     res.status(200).json({status: 'success', payload: location})
   })
 }

 exports.create = function (req, res, next) {
   logger.serverLog(TAG, JSON.stringify(req.body))
   Location.find({}, (err, location) => {
     if (err) {
       return res.status(500).json({
         status: 'failed',
         description: 'internal server error' + JSON.stringify(err)
       })
     }
     if (req.body.locationId === '') {
       return res.render('location', {location, msg: 'location id is required', pageTitle: 'Kia Attendance', env: config.env})
     }
     if (req.body.locationName === '') {
       return res.render('location', {location, msg: 'location name is required', pageTitle: 'Kia Attendance', env: config.env})
     }

     Location.findOne({locationId: req.body.locationId}, (err, user) => {
       if (err) {
         return res.status(500).json({
           status: 'failed',
           description: 'internal server error' + JSON.stringify(err)
         })
       }
       if (user) {
         return res.render('location', {location, msg: 'location is already created.', pageTitle: 'Kia Attendance', env: config.env})
       }
       let accountData = new Location({
         locationId: req.body.locationId,
         locationName: req.body.locationName
       })

       accountData.save(function (err, user) {
         if (err) {
           return res.status(500).json({
             status: 'failed',
             description: 'internal server error' + JSON.stringify(err)
           })
         }
         res.render('location', {location, msg: 'Location is created successfully.', pageTitle: 'Kia Attendance', env: config.env})
       })
     })
   })
 }
