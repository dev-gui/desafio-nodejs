const bcrypt = require('bcrypt')
const { User } = require('../sequelize')
const nodemailer = require('nodemailer')

module.exports = app => {

    const { existsOrError, equalsOrError, notExistsOrError } = app.api.validation

    const save = async (req, resp) => {
        const encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

        const user = { ...req.body }
        if (req.params.id) {
            user.id = req.params.id
        }

        try {
            existsOrError(user.name, 'Nome obrigatório.')
            existsOrError(user.email, 'Email obrigatório.')
            existsOrError(user.password, 'Senha obrigatória.')
            existsOrError(user.passwordConfirm, 'Confirmação de senha obrigatória.')
            existsOrError(user.role, 'Cargo obrigatório.')
            existsOrError(user.interests, 'Interesse(s) obrigatório(s).')
            equalsOrError(user.password, user.passwordConfirm, 'Senhas não conferem.')

            const userFromDb = await User.findOne({ where: { email: user.email } })
            if (!user.id) {
                notExistsOrError(userFromDb, 'Usuário já cadastrado.')
            }
        }
        catch (msg) {
            return resp.status(401).send(msg)
        }

        user.password = encryptPassword(user.password)

        delete user.passwordConfirm

        if (user.id) {

            User.findOne({ where: { id: user.id } })
                .then(user1 => {
                    user1.update(user)
                })
                .then(resp.status(200).send('Usuário alterado.'))
                .catch(error => resp.status(500).send(error))
        }
        else {
            User.create(user)
                .then(() => resp.status(200).send('Usuário salvo'))
                .then(() => {
                    nodemailer.createTestAccount((error, account) => {
                        const transporter = nodemailer.createTransport({
                            host: 'smtp.ethereal.email',
                            port: 587,
                            secure: false,
                            auth: {
                                user: account.user,
                                pass: account.pass
                            }
                        })

                        const mailOptions = {
                            from: 'teste@sassmart.com.br',
                            to: user.email,
                            subject: 'E-mail de teste!',
                            text: 'Testando...'
                        }

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error)
                            } else {
                                console.log('Email enviado: ' + nodemailer.getTestMessageUrl(info))
                            }
                        })
                    })
                })
                .catch(error => resp.status(500).send(error))
        }

    }

    const get = (req, resp) => {
        User.findAll()
            .then(user => resp.status(200).send(user))
            .catch(error => resp.status(400).send(error))
    }

    const remove = (req, resp) => {
        User.destroy({ where: { id: req.params.id } })
            .then(() => resp.status(200).send('Usuário removido.'))
            .catch(error => resp.status(500).send(error))
    }

    return { save, get, remove }
}