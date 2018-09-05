/**
 * Created by saba on 20/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../auth/auth.service')
const controller = require('./attendencepolicy.controller')

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/', controller.create)

module.exports = router
