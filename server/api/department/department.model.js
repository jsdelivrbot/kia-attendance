let mongoose = require('mongoose')
let Schema = mongoose.Schema
let timestamps = require('mongoose-timestamp')

const DepartmentSchema = new Schema({
  entryDate: Date,
  departmentID: Number,
  departmentName: String

})

DepartmentSchema.plugin(timestamps)

module.exports = mongoose.model('department', DepartmentSchema)
