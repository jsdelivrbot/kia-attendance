/**
 * Created by saba on 20/07/2017.
 */

'use strict'

const express = require('express')

const router = express.Router()

const auth = require('../../auth/auth.service')
const controller = require('./employee.controller')

router.get('/', auth.isAuthenticated(), controller.index)
router.post('/', auth.isAuthenticated(), controller.create)
router.post('/update', auth.isAuthenticated(), controller.update)

module.exports = router
