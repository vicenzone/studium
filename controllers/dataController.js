
var path = require('path');

const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
/*
var public_ip = require("ip");

var cloudflare = require('cloudflare')({
    email: 'rwi@rewon.it',
    key: 'your Cloudflare API key'
}); */

const admin = require('firebase-admin');
const serviceAccount = require('../services/firebase.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const root = async (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/home')
    } else {
        res.render(path.join(__dirname + '../../public/html/sign-in.html'), { error: '', page_title: 'Studium Online' });
    }
}

const auth = async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        const cityRef = db.collection('users').doc(username);
        const doc = await cityRef.get();
        if (!doc.exists) {
            res.render(path.join(__dirname + '../../public/html/sign-in.html'), { error: 'Utente non disponibile', page_title: 'Studium Online' });

            //res.json({ code: 'username not fount' })
        } else {
            console.log('Document data:', doc.data());
            //res.json(doc.data())
            var passw = doc.data().account.password

            if (password == passw) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/home');
                res.end();

            } else {
                res.render(path.join(__dirname + '../../public/html/sign-in.html'), { error: 'username/password errati', page_title: 'Studium Online' });
                res.end();
            }
        }

    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }

}

const home = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Welcome back, ' + req.session.username + '!');
        res.render(path.join(__dirname + '../../public/html/dashboard.html'), { page_title: 'Studium Online', top_left_logo_url: 'https://www.centrostudimilano.it/wp-content/uploads/2017/02/logo-Centro-Studi-Milano.jpg' });
    } else {
        res.render(path.join(__dirname + '../../public/html/sign-in.html'), { error: 'Sessiona scaduta o non valida', page_title: 'Studium Online' });
    }
    res.end();
}

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/home');
}

const noEndpoint = (req, res) => {
    res.json({ code: 404 })
}

const writeUser = async (req, res) => {


    /*
        const cityRef = db.collection('users').doc('lorenzofiale');
        const doc = await cityRef.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            console.log('Document data:', doc.data());
            res.json(doc.data().account.password)
        } */

    const data = {
        name: 'lorenzo',
        surname: 'Fiale',
        email: 'info@lorenzofiale.com',
        study_branch: '4-5AFM',
        status: 'active',
        account: {
            password: '123',
            last_login_ip: '127.0.0.33',
            last_login_timestamp: '2021-09-28 08:18:50',
            action_logs: [{
                type: 'login',
                timestamp: 1634237461,
                url: 'https://studium.bianchetti.me'
            }, {
                type: 'lessons',
                timestamp: 1634237565,
                subject: 'English',
                title: 'Business: company type',
                url: 'https://studium.bianchetti.me/lessons/english/9219'
            }, {
                type: 'lessons',
                timestamp: 1634237793,
                subject: 'Italiano',
                title: 'Scuola poetica siciliana',
                url: 'https://studium.bianchetti.me/lessons/italiano/6492'
            }]
        },
        personal_info: {
            street: "Via Stelvio",
            street_number: 21,
            cap: 20150,
            city: 'MI',
            country: 'IT'
        },
        lessons: {
            general_data: {
                tot_hours_lessons: 5,
                remaining_lessons: 2491,
                new_lesson: {
                    lessons_count_last_login: 2141,
                    tot_lessons_currently: 2189
                },
            }
        }
    }


    // Add a new document in collection "cities" with ID 'LA'
    await db.collection('users').doc('vincent').set(data);
    res.json({ msg: 'done' })
}


const tables = async (req, res) => {
    if (req.session.loggedin) {

        res.render(path.join(__dirname + '../../public/html/lessons.html'), {
            page_title: 'Studium online',
            top_left_logo_url: 'https://www.centrostudimilano.it/wp-content/uploads/2017/02/logo-Centro-Studi-Milano.jpg',
            top_left_title: 'Studium online',
            subject_list: ''
        });

    } else {
        //res.render(path.join(__dirname + '../../public/html/sign-in.html'), { error: 'Sessiona scaduta o non valida', page_title: 'Studium Online' });
        res.redirect('/')
    }
    res.end();
}

const subjectTable = async (req, res) => {

    if (req.session.loggedin) {
        const cityRef = db.collection('classes').doc('afm');
        const doc = await cityRef.get();
        if (!doc.exists) {
            res.json({ status: 'error, classes not found', info: 'db query failed, impossible to load classes', help: 'si prega di contattare il reparto tecnico o la segreteria', id: await uidgen.generate() }).status(500);
        } else {
            res.json(doc.data().first.subjects)
        }
    } else {
        res.json({ status: 'request not allowed', info: 'login required', id: await uidgen.generate() }).status(401);
    }

}

/*
const dynamicDNSsetup = async (req, res) => {
    public_ip.address();
} */
const accountLogs = async (req, res) => {
    const cityRef = db.collection('users').doc(req.session.username);
    const doc = await cityRef.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        res.json(doc.data().account.action_logs)
    }
}

const lastLessonsWatched = async (req, res) => {
    res.json([
        {
            "icon_url": "https://img.icons8.com/external-wanicon-lineal-color-wanicon/50/000000/external-history-university-courses-wanicon-lineal-color-wanicon.png",
            "name": "Lingua e Letteratura Italiana"
        },
        {
            "name": "Lingua Inglese",
            "icon_url": "https://img.icons8.com/doodle/48/000000/great-britain.png"
        },
        {
            "icon_url": "https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/60/000000/external-spain-flags-vitaliy-gorbachev-lineal-color-vitaly-gorbachev.png",
            "name": "Seconda Lingua Comunitaria"
        },
        {
            "icon_url": "https://img.icons8.com/external-itim2101-lineal-color-itim2101/64/000000/external-economy-computer-technology-itim2101-lineal-color-itim2101.png",
            "name": "Economia Aziendale"
        },
        {
            "name": "Storia Cittadinanza e Costitutzione",
            "icon_url": "https://img.icons8.com/fluency/48/000000/law.png"
        }]
    )
}


const getLessonsOfSubjectAPI = async (req, res) => {

    const cityRef = db.collection('classes').doc('afm');
    const doc = await cityRef.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        const data = []
        doc.data().first.subjects.forEach(element => {
            if (element.id && element.id == req.params.id) {
                console.log(element);
                data.push(element)
            }
        });
        res.json(data)
    }
}

const getLessonsOfSubject = async (req, res) => {
    if (req.session.loggedin) {
        if (req.params.id) {
            res.render(path.join(__dirname + '../../public/html/argoments.html'), {
                page_title: 'Studium online',
                top_left_logo_url: 'https://www.centrostudimilano.it/wp-content/uploads/2017/02/logo-Centro-Studi-Milano.jpg',
                top_left_title: 'Studium online',
                subject_list: ''
            });
        }
    } else {
        //res.render(path.join(__dirname + '../../public/html/sign-in.html'), { error: 'Sessiona scaduta o non valida', page_title: 'Studium Online' });
        res.redirect('/')
    }
    res.end();
}

const viewLessons = (req, res) => {
    res.render(path.join(__dirname + '../../public/html/player.html'))
}
module.exports = {
    root,
    auth,
    home,
    logout,
    noEndpoint,
    writeUser,
    tables,
    subjectTable,
    accountLogs,
    lastLessonsWatched,
    getLessonsOfSubjectAPI,
    getLessonsOfSubject,
    viewLessons
}