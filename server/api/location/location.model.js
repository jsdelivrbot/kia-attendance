let mongoose = require('mongoose')
let Schema = mongoose.Schema
let timestamps = require('mongoose-timestamp')

const LocationSchema = new Schema({
  locationId: Number,
  locationName: String

})
LocationSchema.plugin(timestamps)

module.exports = mongoose.model('location', LocationSchema)
