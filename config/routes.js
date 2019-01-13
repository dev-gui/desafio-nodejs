module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)
    //teste
    app.get('/network/:interest', app.api.networking.getNetwork)

    app.route('/usuario')
        .all(app.config.passport.authenticate())
        .get(app.api.user.get)
        .post(app.api.user.save)

    app.route('/usuario/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.user.save)
        .delete(app.api.user.remove)
}