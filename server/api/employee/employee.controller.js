/**
 * Created by saba on 27/07/2017.
 */

 const Employee = require('./employee.model')
 const Designation = require('./../designation/designation.model')
 const Department = require('./../department/department.model')
 const Location = require('./../location/location.model')
 const Grade = require('./../grade/grade.model')
 const config = require('../../config/environment')
 const utility = require('../../components/utility')

 const logger = require('../../components/logger')

 const TAG = 'api/user/wmployee.controller.js'

 exports.index = function (req, res) {
   Department.findOne({_id: req.user._id}, (err, employee) => {
     if (err) {
       return res.status(500).json({
         status: 'failed',
         description: 'internal server error' + JSON.stringify(err)
       })
     }
     if (!employee) {
       return res.status(404)
         .json({status: 'failed', description: 'employee not found'})
     }
     logger.serverLog(TAG, 'employee object sent to client')
     res.status(200).json({status: 'success', payload: employee})
   })
 }

 exports.create = function (req, res, next) {
   logger.serverLog(TAG, JSON.stringify(req.body))
   Designation.find({}, (err, designations) => {
     if (err) {
       return res.status(500).json({
         status: 'failed',
         description: 'internal server error' + JSON.stringify(err)
       })
     }
     Department.find({}, (err, departments) => {
       if (err) {
         return res.status(500).json({
           status: 'failed',
           description: 'internal server error' + JSON.stringify(err)
         })
       }
       Location.find({}, (err, locations) => {
         if (err) {
           return res.status(500).json({
             status: 'failed',
             description: 'internal server error' + JSON.stringify(err)
           })
         }
         Grade.find({}, (err, grades) => {
           if (err) {
             return res.status(500).json({
               status: 'failed',
               description: 'internal server error' + JSON.stringify(err)
             })
           }
           if (req.body.employeeId === '') {
             return res.render('employee', {designations, msg: 'Employee id is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
           }

           Employee.findOne({employeeId: req.body.employeeID}, (err, user) => {
             if (err) {
               return res.status(500).json({
                 status: 'failed',
                 description: 'internal server error' + JSON.stringify(err)
               })
             }
             if (user) {
               let date = new Date(user.dateOfJoining)
               user.dateOfJoiningModified = date.getFullYear() + '-' + utility.padNumber((date.getMonth() + 1), 2) + '-' + utility.padNumber(date.getDate(), 2)
               return res.render('employee', {designations, employee: user, msg: 'Employee is already created. You can update it.', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
             }
             if (req.body.employeeName === '') {
               return res.render('employee', {designations, msg: 'Employee name is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
             }
             if (req.body.designationId === '') {
               return res.render('employee', {designations, msg: 'Designation Id is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
             }
             if (req.body.employeeStatus === '') {
               return res.render('employee', {designations, msg: 'Status Id is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
             }
             if (req.body.dateOfJoining === '') {
               return res.render('employee', {designations, msg: 'Date is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
             }
             if (req.body.TmachineID === '') {
               return res.render('employee', {designations, msg: 'Machine ID is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
             }
             if (req.body.departmentID === '') {
               return res.render('employee', {designations, msg: 'Department Id is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
             }
             if (req.body.locationId === '') {
               return res.render('employee', {designations, msg: 'Location Id is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
             }
             if (req.body.gradeId === '') {
               return res.render('employee', {designations, msg: 'grade Id is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
             }
             let accountData = new Employee({
               employeeId: req.body.employeeID,
               employeeName: req.body.employeeName,
               designationID: req.body.designationId,
               departmentID: req.body.departmentID,
               empStatus: req.body.employeeStatus,
               dateOfJoining: req.body.dateOfJoining,
               TmachineID: req.body.TmachineID,
               locationId: req.body.locationId,
               gradeId: req.body.gradeId
             })

             accountData.save(function (err, user) {
               if (err) {
                 return res.status(500).json({
                   status: 'failed',
                   description: 'internal server error' + JSON.stringify(err)
                 })
               }
               res.render('employee', {msg: 'Employee is created successfully.', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
             })
           })
         })
       })
     })
   })
 }

 exports.update = function (req, res, next) {
   logger.serverLog(TAG, JSON.stringify(req.body))
   Designation.find({}, (err, designations) => {
     if (err) {
       return res.status(500).json({
         status: 'failed',
         description: 'internal server error' + JSON.stringify(err)
       })
     }
     Department.find({}, (err, departments) => {
       if (err) {
         return res.status(500).json({
           status: 'failed',
           description: 'internal server error' + JSON.stringify(err)
         })
       }
       Location.find({}, (err, locations) => {
         if (err) {
           return res.status(500).json({
             status: 'failed',
             description: 'internal server error' + JSON.stringify(err)
           })
         }
         Grade.find({}, (err, grades) => {
           if (err) {
             return res.status(500).json({
               status: 'failed',
               description: 'internal server error' + JSON.stringify(err)
             })
           }
           if (req.body.employeeId === '') {
             return res.render('employee', {designations, msg: 'Employee id is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
           }

           Employee.findOne({employeeId: req.body.employeeID}, (err, user) => {
             if (err) {
               return res.status(500).json({
                 status: 'failed',
                 description: 'internal server error' + JSON.stringify(err)
               })
             }
             if (user) {
               if (req.body.employeeName === '') {
                 return res.render('employee', {designations, msg: 'Employee name is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
               }
               if (req.body.designationId === '') {
                 return res.render('employee', {designations, msg: 'Designation Id is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
               }
               if (req.body.employeeStatus === '') {
                 return res.render('employee', {designations, msg: 'Status Id is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
               }
               if (req.body.dateOfJoining === '') {
                 return res.render('employee', {designations, msg: 'Date is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
               }
               if (req.body.TmachineID === '') {
                 return res.render('employee', {designations, msg: 'Machine ID is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
               }
               if (req.body.departmentID === '') {
                 return res.render('employee', {designations, msg: 'Department Id is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
               }
               if (req.body.locationId === '') {
                 return res.render('employee', {designations, msg: 'Location Id is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
               }
               if (req.body.gradeId === '') {
                 return res.render('employee', {designations, msg: 'grade Id is required', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
               }
               user.employeeName = req.body.employeeName
               user.designationID = req.body.designationId
               user.departmentID = req.body.departmentID
               user.empStatus = req.body.employeeStatus
               user.dateOfJoining = req.body.dateOfJoining
               user.TmachineID = req.body.TmachineID
               user.locationId = req.body.locationId
               user.gradeId = req.body.gradeId

               user.save(function (err, user) {
                 if (err) {
                   return res.status(500).json({
                     status: 'failed',
                     description: 'internal server error' + JSON.stringify(err)
                   })
                 }
                 res.render('employee', {msg: 'Employee is updated successfully.', employee: user, grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
               })
             } else {
               return res.render('employee', {designations, msg: 'Invalid employee id', grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env})
             }
           })
         })
       })
     })
   })
 }
