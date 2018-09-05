const Users = require('./../api/user/users.model')
const Attendance = require('./../api/attendance/attendance.model')
const Designation = require('./../api/designation/designation.model')
const Grade = require('./../api/grade/grade.model')
const Location = require('./../api/location/location.model')
const Employee = require('./../api/employee/employee.model')
const Department = require('./../api/department/department.model')
const config = require('./../config/environment')
const Attendencepolicy = require('./../api/attendencepolicy/attendencepolicy.model')
const logger = require('./../components/logger')

const _ = require('lodash')

const TAG = 'viewControllers/index'

exports.index = function (req, res) {
  Attendance.find({}, (err, attendance) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    res.render('index', { attendance, user: req.user, pageTitle: 'Kia Attendance', env: config.env })
  })
}

exports.attendanceReport = function (req, res) {
  Attendance.find({}, (err, attendance) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    res.render('index', { attendance, user: req.user, pageTitle: 'Kia Attendance', env: config.env })
  })
}

exports.customReport = function (req, res) {
  Attendance.find({}, (err, attendance) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    res.render('customreport', {attendance, user: req.user, pageTitle: 'Custom Attendance Report', env: config.env})
  })
}

exports.createEmployee = function (req, res) {
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
          res.render('employee', { grades, locations, departments, designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env })
        })
      })
    })
  })
}

exports.createDepartment = function (req, res) {
  Designation.find({}, (err, designations) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    res.render('department', { designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env })
  })
}

exports.createDesignation = function (req, res) {
  Designation.find({}, (err, designations) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    res.render('designation', { designations, user: req.user, pageTitle: 'Kia Attendance', env: config.env })
  })
  // res.render('designation', {user: req.user, pageTitle: 'Kia Attendance', env: config.env})
}

exports.createGrade = function (req, res) {
  Grade.find({}, (err, grade) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    res.render('grade', { grade, user: req.user, pageTitle: 'Kia Attendance', env: config.env })
  })
}

exports.createLocation = function (req, res) {
  Location.find({}, (err, location) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    res.render('location', { location, user: req.user, pageTitle: 'Kia Attendance', env: config.env })
  })
}

exports.createAttendencepolicy = function (req, res) {
  Attendencepolicy.find({}, (err, attendencepolicy) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    res.render('attendencepolicy', { attendencepolicy, user: req.user, pageTitle: 'Kia Attendance', env: config.env })
  })
}

exports.setup = function (req, res) {
  res.render('setup', { pageTitle: 'Kia Attendance', env: config.env })
}

exports.login = function (req, res) {
  res.render('login', { pageTitle: 'Kia Attendance', env: config.env })
}

exports.uploadFile = function (req, res) {
  console.log('going to see uploaded file')
  console.log(req.files.file)
  Attendance.find({}, (err, attendance) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    if (!req.files) { return res.status(400).send('No files were uploaded.') }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.file

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(__dirname + '/kiaFile.csv', function (err) {
      if (err) { return res.status(500).send(err) }

      const csvFilePath = __dirname + '/kiaFile.csv'
      const csv = require('csvtojson')
      csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
          let employeeIDs = new Set()
          for (let i = 0; i < jsonObj.length; i++) {
            let employeeId = jsonObj[i]['AC-No']['']
            if (!employeeIDs.has(employeeId)) {
              Employee.findOne({ employeeId: employeeId }, (err, employee) => {
                if (err) {
                  return logger.serverLog(TAG, err)
                }
                if (!employee) {
                  Department.findOne({ departmentName: jsonObj[i]['Department'] }, (err, department) => {
                    if (err) {
                      return logger.serverLog(TAG, err)
                    }
                    let departmentID = ''
                    if (department) {
                      departmentID = department.departmentID
                    }
                    Location.findOne({ locationName: jsonObj[i]['Location'] }, (err, location) => {
                      if (err) {
                        return logger.serverLog(TAG, err)
                      }
                      let locationID = ''
                      if (location) {
                        locationID = location.locationId
                      }
                      Designation.findOne({ designationName: jsonObj[i]['Title'] }, (err, designation) => {
                        if (err) {
                          return logger.serverLog(TAG, err)
                        }
                        let designationID = ''
                        if (designation) {
                          designationID = designation.designationID
                        }

                        // let joinDateArray = jsonObj[i]['Date of Employeement'].split('/')
                        Employee.create({
                          employeeId: employeeId,
                          employeeName: jsonObj[i]['Name'],
                          departmentID: departmentID,
                          TmachineID: jsonObj[i]['AC-No'][''],
                          designationID: designationID,
                          // dateOfJoining: joinDateArray.length === 3 ? new Date(joinDateArray[2], joinDateArray[1] - 1, joinDateArray[0]) : '',
                          locationId: locationID
                        }, (err, payload) => {
                          if (err) {
                            return logger.serverLog(TAG, err)
                          }
                          console.log('Employee created', payload.employeeId)
                        })
                      })
                    })
                  })
                }
              })
            }

            let dateArray = jsonObj[i].Date.split('/')
            calculateStatus(jsonObj[i], (status) => {
              let data = {
                date: new Date(dateArray[2].length === 2 ? '20' + dateArray[2] : dateArray[2], dateArray[1] - 1, dateArray[0]),
                employeeName: jsonObj[i].Name,
                employeeId: employeeId,
                department: jsonObj[i].Department,
                clockIn: jsonObj[i]['Clock In'],
                clockOut: jsonObj[i]['Clock Out'],
                lateTime: jsonObj[i].Late,
                earlyTime: jsonObj[i].Early,
                absent: (jsonObj[i].Absent === 'True'),
                day: jsonObj[i].week,
                clockInStatus: status.clockInStatus,
                clockOutStatus: status.clockOutStatus
              }
              Attendance.create(data, (err, payload) => {
                if (err) {
                  logger.serverLog(TAG, err)
                }
                logger.serverLog(TAG, 'Attendance record inserted for ' + payload.employeeName)
              })
            })

            employeeIDs.add(employeeId)
          }
          var fs = require('fs')
          var filePath = __dirname + '/kiaFile.csv'
          fs.unlinkSync(filePath)
        })

      res.render('index', { attendance, user: req.user, pageTitle: 'Kia Attendance', env: config.env })
    })
  })
}

function calculateStatus (attendance, callback) {
  Attendencepolicy.find({}, (err, attendancePolicies) => {
    if (err) {
      return logger.serverLog(TAG, err)
    }
    let clockInPolicies = attendancePolicies.filter((policy) => {
      return policy.attendencepolicyDescription.startsWith('clock in')
    })

    let clockOutPolicies = attendancePolicies.filter((policy) => {
      return policy.attendencepolicyDescription.startsWith('clock out')
    })
    let clockInStatus = 'no show'
    let clockOutStatus = 'no show'
    if (!attendance.absent) {
      if (attendance['Clock In']) {
        let clockIn = new Date()
        let clockInTime = attendance['Clock In'].split(':')

        clockIn.setHours(clockInTime[0])
        clockIn.setMinutes(clockInTime[1])
        clockIn.setSeconds(0)

        for (let policy of clockInPolicies) {
          let policyTimeFrom = policy.timeFrom.split(':')
          let policyTimeTo = policy.timeTo.split(':')

          let timeFrom = new Date()
          let timeTo = new Date()

          timeFrom.setHours(policyTimeFrom[0])
          timeFrom.setMinutes(policyTimeFrom[1])
          timeFrom.setSeconds(0)

          timeTo.setHours(policyTimeTo[0])
          timeTo.setMinutes(policyTimeTo[1])
          timeFrom.setSeconds(0)

          if (clockIn >= timeFrom && clockIn <= timeTo) {
            clockInStatus = policy.attendencepolicyDescription
            break
          }
        }
      }
      if (attendance['Clock Out']) {
        let clockOut = new Date()
        let clockOutTime = attendance['Clock Out'].split(':')

        clockOut.setHours(clockOutTime[0])
        clockOut.setMinutes(clockOutTime[1])
        clockOut.setSeconds(0)

        for (let policy of clockOutPolicies) {
          let policyTimeFrom = policy.timeFrom.split(':')
          let policyTimeTo = policy.timeTo.split(':')

          let timeFrom = new Date()
          let timeTo = new Date()

          timeFrom.setHours(policyTimeFrom[0])
          timeFrom.setMinutes(policyTimeFrom[1])
          timeFrom.setSeconds(0)

          timeTo.setHours(policyTimeTo[0])
          timeTo.setMinutes(policyTimeTo[1])
          timeFrom.setSeconds(0)

          if (clockOut >= timeFrom && clockOut <= timeTo) {
            clockOutStatus = policy.attendencepolicyDescription
            break
          }
        }
      }
    }
    callback({
      'clockInStatus': clockInStatus,
      'clockOutStatus': clockOutStatus
    })
  })
}
