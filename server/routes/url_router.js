const express = require('express')
const urlController = require('./../controllers/url_controller')
const getAllUrls = require('./../controllers/url_controller')
const protect = require('../middlewares/auth')

const urlRouter = express.Router()

urlRouter.route('/shorten/').post(protect, urlController.shorten)
urlRouter.route('/redirect/:code').get(urlController.redirect)
urlRouter.route('/').get(protect, urlController.getAllUrls)

module.exports = urlRouter
