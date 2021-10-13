const unAuthorized = (req, res) => {
    res.json({
        msg: 'richiesta di accesso a file statici non autorizzata'
    }).status(401)
}

const noAuth = (req, res) => {
    res.json({
        msg: 'richiesta di accesso a file statici non autorizzata'
    }).status(401)
}



const loginRedirect = (req, res) => {
    res.redirect('/app')
}

module.exports = {
    unAuthorized,
    noAuth,
    loginRedirect
}