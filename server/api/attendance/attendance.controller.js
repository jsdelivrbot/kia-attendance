/**
 * Created by saba on 27/07/2017.
 */

const Attendance = require('./Attendance.model')
const logger = require('../../components/logger')

const TAG = 'api/user/Attendance.controller.js'

exports.index = function (req, res) {
  Attendance.findOne({_id: req.user._id}, (err, attendance) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    if (!attendance) {
      return res.status(404)
        .json({status: 'failed', description: 'Attendance not found'})
    }
    logger.serverLog(TAG, 'Attendance object sent to client')
    res.status(200).json({status: 'success', payload: attendance})
  })
}

exports.getCustomReport = function (req, res) {
  logger.serverLog(TAG, 'in getCustomReport API call')
  logger.serverLog(TAG, JSON.stringify(req.body))
  try {
    Attendance.aggregate([
        {$match: {'date': {'$gte': new Date(req.body.dateFrom), '$lte': new Date(req.body.dateTo)}}},
      {
        $group: {
          '_id': '$employeeId',
          'attendanceRecords': {$push: {
            employeeName: '$employeeName',
            employeeId: '$employeeId',
            clockIn: '$clockIn',
            clockOut: '$clockOut',
            date: '$date'
          }}
        }
      }],
        (err, attendances) => {
          if (err) {
            logger.serverLog(TAG, JSON.stringify(err))
            return res.status(500).json({
              status: 'failed',
              description: 'internal server error' + JSON.stringify(err)
            })
          }
          if (attendances.length === 0) {
            logger.serverLog('No attendances found')
            return res.status(404)
            .json({status: 'failed', description: 'Attendances not found'})
          }
          logger.serverLog(TAG, 'succesfully got custom report')
          res.status(200).json({status: 'success', payload: attendances})
        })
  } catch (err) {
    logger.serverLog(TAG, 'ERROR')
    logger.serverLog(TAG, err)
  }
}
