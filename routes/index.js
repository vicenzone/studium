const Router = require('express').Router
const router = new Router()

const dataController = require('../controllers/dataController.js')

router.get('/', dataController.root)
router.post('/auth', dataController.auth);
router.get('/home', dataController.home);
router.get('/logout', dataController.logout);
router.get('/writeuser', dataController.writeUser);

router.get('/lessons', dataController.tables);

router.get('/api/account/logs', dataController.accountLogs)
router.get('/api/subject/all', dataController.subjectTable);


router.get('*', dataController.noEndpoint);
module.exports = router
