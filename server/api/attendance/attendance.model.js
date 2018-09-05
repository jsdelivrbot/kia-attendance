let mongoose = require('mongoose')
let Schema = mongoose.Schema
let timestamps = require('mongoose-timestamp')

const AttendanceSchema = new Schema({
  date: Date,
  employeeId: Number,
  department: String,
  clockIn: String,
  clockOut: String,
  lateTime: String,
  earlyTime: String,
  absent: Boolean,
  day: String,
  clockInStatus: String,
  clockOutStatus: String,
  employeeName: String
})

AttendanceSchema.plugin(timestamps)

//module.exports = mongoose.model('attendances', AttendanceSchema)
let attendanceModel = null
try {
  attendanceModel = mongoose.model('attendances', AttendanceSchema)
} catch (e) {
  attendanceModel = mongoose.model('attendances')
}

module.exports = attendanceModel
