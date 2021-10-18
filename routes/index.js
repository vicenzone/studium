const Router = require('express').Router
const router = new Router()

const dataController = require('../controllers/dataController.js')

router.get('/', dataController.root)
router.post('/auth', dataController.auth);
router.get('/home', dataController.home);
router.get('/logout', dataController.logout);
router.get('/writeuser', dataController.writeUser);
router.get('/profile', dataController.profile);


router.get('/lessons', dataController.tables);

router.get('/api/account/logs', dataController.accountLogs)
router.get('/api/subject/all', dataController.subjectTable);
router.get('/api/lessons/last_watched', dataController.lastLessonsWatched)

router.get('/api/lessons/:id/argoments/', dataController.getLessonsOfSubjectAPI)
router.get('/argoments/:id', dataController.getLessonsOfSubject)

router.get('/player/:id', dataController.viewLessons)

router.get('*', dataController.noEndpoint);
module.exports = router
