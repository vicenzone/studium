
const verify = (req, res, next) => {
    if (req.session.loggedin) {
        return next();
    } else {
        res.redirect('/')
    }
};

module.exports = verify;