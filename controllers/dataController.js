
var path = require('path');

const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();

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
        const user = db.collection('users').doc(username);
        const doc = await user.get();
        if (!doc.exists) {
            res.render(path.join(__dirname + '../../public/html/sign-in.html'), { error: 'Utente non disponibile', page_title: 'Studium Online' });

            //res.json({ code: 'username not fount' })
        } else {
            console.log('Document data:', doc.data());
            //res.json(doc.data())
            var passw = doc.data().account.password
            var class_number_branch = doc.data().study_branch

            if (password == passw) {
                req.session.loggedin = true;
                req.session.username = username;

                const class_years = []
                for (let i = 0; i < class_number_branch.length; i++) {
                    const element = class_number_branch[i];
                    class_years.push(element)
                }
                console.log(class_years);

                req.session.class_number_branch = class_years;
                req.session.activeYear = class_number_branch[0]
                res.redirect('/home');
                console.log(req.session);
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
    //res.send('Welcome back, ' + req.session.username + '!');
    res.render(path.join(__dirname + '../../public/html/dashboard.html'), {
        page_title: 'Studium Online',
        top_left_logo_url: 'https://www.centrostudimilano.it/wp-content/uploads/2017/02/logo-Centro-Studi-Milano.jpg'
    });
}

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/home');
}

const noEndpoint = (req, res) => {
    res.json({ code: 404 })
}

const writeUser = async (req, res) => {
    // Add a new document in collection "cities" with ID 'LA'
    await db.collection('users').doc('vincent').set(data);
    res.json({ msg: 'done' })
}

const tables = async (req, res) => {
    res.render(path.join(__dirname + '../../public/html/lessons.html'), {
        page_title: 'Studium online',
        top_left_logo_url: 'https://www.centrostudimilano.it/wp-content/uploads/2017/02/logo-Centro-Studi-Milano.jpg',
        top_left_title: 'Studium online',
        subject_list: ''
    });


}

const subjectTable = async (req, res) => {
    const cityRef = db.collection('classes').doc(req.session.activeYear);
    const doc = await cityRef.get();
    if (!doc.exists) {
        res.json({ status: 'error, classes not found', info: 'db query failed, impossible to load classes', help: 'si prega di contattare il reparto tecnico o la segreteria', id: await uidgen.generate() }).status(500);
    } else {
        res.json(doc.data().first.subjects)
    }
}

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
    const cityRef = db.collection('classes').doc(req.session.activeYear);
    const doc = await cityRef.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        const data = []
        doc.data().first.subjects.forEach(element => {
            if (element.id && element.id == req.params.id) {
                console.log(element.argoments);
                data.push(element.argoments)
            }
        });
        console.log(data[0]);
        res.json(data[0])
    }
}

const getLessonsOfSubject = async (req, res) => {
    if (req.params.id) {
        res.render(path.join(__dirname + '../../public/html/argoments.html'), {
            page_title: 'Studium online',
            top_left_logo_url: 'https://www.centrostudimilano.it/wp-content/uploads/2017/02/logo-Centro-Studi-Milano.jpg',
            top_left_title: 'Studium online',
            subject_list: ''
        });
    }
}


const viewLessons = async (req, res) => {
    if (req.query.vd && req.params.id) {
        const videoRef = db.collection('classes').doc(req.session.activeYear);
        const doc = await videoRef.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            const data = []
            doc.data().first.subjects.forEach(element => {
                if (element.id && element.id == req.params.id) {
                    data.push(element.argoments)
                }
            });
            if (data[0][req.query.vd]) {
                console.log(data[0][req.query.vd]);
                return res.render(path.join(__dirname + '../../public/html/player.html'), {
                    page_title: 'Studium online',
                    top_left_logo_url: 'https://www.centrostudimilano.it/wp-content/uploads/2017/02/logo-Centro-Studi-Milano.jpg',
                    top_left_title: 'Studium online',

                    video_url: data[0][req.query.vd].url,
                    lessons_name: data[0][req.query.vd].name,

                })
            }
        }
    }
    return res.redirect('/404?vid=')
}

const profile = (req, res) => {
    res.render(path.join(__dirname + '../../public/html/profile.html'), {
        page_title: 'Studium online',
        top_left_logo_url: 'https://www.centrostudimilano.it/wp-content/uploads/2017/02/logo-Centro-Studi-Milano.jpg',
        name: 'Vincent',
        surname: 'Bianchetti',
        class: '3AFM',
        info_email: 'vincent@bianchetti.me',
        info_phone: '+39 3473477316',
        info_street: 'Via degli Ottoboni, 37, Milano, MI',
        session_last_login_ip: '82.84.89.28',
        last_login_state: 'IT',
        last_login_device: 'OSX - Apple',

    })
    res.end();
}

const getActiveYear = async (req, res) => {
    const user = db.collection('users').doc(req.session.username);
    const doc = await user.get();
    var class_number_branch = doc.data().study_branch;
    var active_year = req.session.activeYear;
    res.json({
        years: class_number_branch,
        active_year: req.session.activeYear
    })
}

const changeActiveYear = async (req, res) => {
    const user = db.collection('users').doc(req.session.username);
    const doc = await user.get();
    var class_number_branch = doc.data().study_branch;

    if (class_number_branch.includes(req.params.year)) {
        req.session.activeYear = req.params.year;
        if (req.query.json == 'true') {
            return res.json({
                msg: "done",
                active_year: req.session.activeYear
            })
        } else {
            res.redirect('/')
        }
    }
    if (req.query.json == 'true') {
        return res.json({
            msg: 'failed',
            info: 'invalid or non active year selected'
        })
    } else {
        res.redirect('/500', {
            msg: 'invalid or non active year selected'
        }).status(500)
    }
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
    viewLessons,
    profile,
    getActiveYear,
    changeActiveYear
}