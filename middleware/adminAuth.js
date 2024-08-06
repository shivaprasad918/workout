const isLogin = async (req, res, next) => {
    try {
        if (req.session.admin) {
            next();
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/admin'); // Redirect in case of an error
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.admin) {
            res.redirect('/admin/dashboard');
        } else {
            next();
           
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/admin'); // Redirect in case of an error
    }
}

module.exports = {
    isLogin,
    isLogout
}
