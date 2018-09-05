let mongoose = require('mongoose')
let Schema = mongoose.Schema
let timestamps = require('mongoose-timestamp')

const DesignationSchema = new Schema({
  designationId: Number,
  designationName: String
})

DesignationSchema.plugin(timestamps)

module.exports = mongoose.model('designation', DesignationSchema)
