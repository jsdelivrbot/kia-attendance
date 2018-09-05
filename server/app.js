/**
 * Created by saba on 23/11/2017.
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development' // production

const express = require('express')
const mongoose = require('mongoose')
const config = require('./config/environment/index')
const fileUpload = require('express-fileupload')

const app = express()
app.use(fileUpload())

mongoose.connect(config.mongo.uri, config.mongo.options)

require('./config/express')(app)
require('./config/setup')(app, config)
require('./config/seed')(config)
require('./routes')(app)
