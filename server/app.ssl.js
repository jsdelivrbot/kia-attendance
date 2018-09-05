/**
 * Created by saba on 23/11/2017.
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development' // production

const express = require('express')
const mongoose = require('mongoose')
const config = require('./config/environment/index')

const app = express()
const httpApp = express()

mongoose.connect(config.mongo.uri, config.mongo.options)

const appObj = (config.env === 'production' || config.env === 'staging') ? app : httpApp

require('./config/express')(appObj)
require('./config/setup.ssl')(app, httpApp, config)
require('./routes')(appObj)
