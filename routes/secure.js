const Router = require('express').Router
const router = new Router()

const secureController = require('../controllers/secureController.js')


//router.get('/', secureController.loginRedirect)

router.get('/html/*', secureController.unAuthorized)
router.get('/app/*', secureController.noAuth)

module.exports = router
