/**
 * Created by saba on 24/07/2017.
 */

// Production specific configuration
// ==================================
module.exports = {
  // MySQL connection options
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost/attendance'
  },
  seedDB: true
}
