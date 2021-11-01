const Router = require('express').Router
const router = new Router()

const dataController = require('../controllers/dataController.js')
const session = require("../middleware/session");

/*

    !!!! WARNING !!!!

    all: page should be secured by JSON WEB TOKEN
    all: API endpoint should be secured by one-time-key
    all: video API/PAGE RENDER must use Media Session Key or something that protect copyrighted media

*/


// PAGE RENDERING
router.get('/', dataController.root)
router.post('/auth', dataController.auth);
router.get('/home', session, dataController.home);
router.get('/logout', session, dataController.logout);
router.get('/writeuser', session, dataController.writeUser);
router.get('/profile', session, dataController.profile);

//LESSONS SERVICES
router.get('/lessons', session, dataController.tables);


// API SERVICES
router.get('/api/account/logs', session, dataController.accountLogs)
router.get('/api/subject/all', session, dataController.subjectTable);
router.get('/api/lessons/last_watched', session, dataController.lastLessonsWatched)
router.get('/api/lessons/:id/argoments/', session, dataController.getLessonsOfSubjectAPI)

// LESSONS LOADER
router.get('/argoments/:id', session, dataController.getLessonsOfSubject)
router.get('/player/:id', session, dataController.viewLessons)

// API SERVICES  [2] - SESSION MANAGER
router.get('/api/session/activeYear', session, dataController.getActiveYear)
router.get('/api/session/setYear/:year', session, dataController.changeActiveYear)

// TEST ENDPOINT
router.get('/api/testpoint', session, dataController.testPoint)

// PAGE RENDER - ADMIN 
router.get('/backoffice', dataController.Admin_Dashboard)
// ERROR PAGE RENDER
router.get('/error/:errCode', dataController.errorPage)

router.get('*', dataController.noEndpoint);
module.exports = router
