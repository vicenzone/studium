const Router = require('express').Router
const router = new Router()

const dataController = require('../controllers/dataController.js')
const session = require("../middleware/session");


router.get('/', dataController.root)
router.post('/auth', dataController.auth);
router.get('/home', session, dataController.home);
router.get('/logout', session, dataController.logout);
router.get('/writeuser', session, dataController.writeUser);
router.get('/profile', session, dataController.profile);


router.get('/lessons', session, dataController.tables);

router.get('/api/account/logs', session, dataController.accountLogs)
router.get('/api/subject/all', session, dataController.subjectTable);
router.get('/api/lessons/last_watched', session, dataController.lastLessonsWatched)

router.get('/api/lessons/:id/argoments/', session, dataController.getLessonsOfSubjectAPI)
router.get('/argoments/:id', session, dataController.getLessonsOfSubject)

router.get('/player/:id', session, dataController.viewLessons)

router.get('/api/session/activeYear', session, dataController.getActiveYear)

router.get('*', dataController.noEndpoint);
module.exports = router
