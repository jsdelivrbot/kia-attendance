/**
 * Created by saba on 20/07/2017.
 */
'use strict'

const express = require('express')

const router = express.Router()

// const logger = require('../components/logger')
// const TAG = 'auth/index.js'

const config = require('../config/environment')
const Users = require('../api/user/users.model')
const auth = require('./auth.service')

require('./local/passport').setup(Users, config)

router.use('/local', require('./local'))

router.get('/logout', auth.logout)

module.exports = router
