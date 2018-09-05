let mongoose = require('mongoose')
let Schema = mongoose.Schema
let timestamps = require('mongoose-timestamp')

const GradeSchema = new Schema({
  gradeId: Number,
  gradeName: String

})
GradeSchema.plugin(timestamps)

module.exports = mongoose.model('grade', GradeSchema)
