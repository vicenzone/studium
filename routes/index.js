const Router = require('express').Router
const router = new Router()

const dataController = require('../controllers/dataController.js')

router.get('/', dataController.root)
router.post('/auth', dataController.auth);
router.get('/home', dataController.home);
router.get('/logout', dataController.logout);
router.get('/writeuser', dataController.writeUser);

router.get('/tables', dataController.tables);
router.get('/subject/json', dataController.subjectTable);


router.get('*', dataController.noEndpoint);
module.exports = router
