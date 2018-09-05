'use strict'

var express = require('express')
var passport = require('passport')
var auth = require('../auth.service')
var User = require('./../../api/user/users.model.js')

var router = express.Router()

router.post('/', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info
    if (error) return res.render('login', {msg: error.message, pageTitle: 'Kia Attendance'})
    if (!user) return res.json(404).json({message: 'Something went wrong, please try again.'})

    req.user = user
    auth.setTokenCookie(req, res)
  })(req, res, next)
})

module.exports = router
