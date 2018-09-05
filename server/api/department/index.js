/**
 * Created by saba on 20/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../auth/auth.service')
const controller = require('./department.controller')

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/', auth.isAuthenticated(), controller.create)

module.exports = router
