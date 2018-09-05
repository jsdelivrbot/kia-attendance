let mongoose = require('mongoose')
let Schema = mongoose.Schema
let timestamps = require('mongoose-timestamp')

const EmployeeSchema = new Schema({
  employeeId: Number,
  employeeName: String,
  departmentID: Number,
  TmachineID: Number,
  designationID: Number,
  dateOfJoining: Date,
  empStatus: String,
  gradeId: Number,
  locationId: Number
})

EmployeeSchema.plugin(timestamps)

module.exports = mongoose.model('employee', EmployeeSchema)
