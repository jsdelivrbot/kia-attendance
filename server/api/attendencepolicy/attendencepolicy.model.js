let mongoose = require('mongoose')
let Schema = mongoose.Schema
let timestamps = require('mongoose-timestamp')

const AttendencePolicySchema = new Schema({
  attendencepolicyId: Number,
  attendencepolicyDescription: String,
  timeFrom: String,
  timeTo: String

})

AttendencePolicySchema.plugin(timestamps)

module.exports = mongoose.model('attendencepolicy', AttendencePolicySchema)
