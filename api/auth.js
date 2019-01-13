const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const { User } = require('../sequelize')
const bcrypt = require('bcrypt')

module.exports = app => {
    const signin = async (req, resp) => {
        //Verifica se o usuário digitou a senha e email
        if (!req.body.email || !req.body.password) {
            return resp.status(400).send('Dados incompletos.')
        }

        const user = await User.findOne({ where: { email: req.body.email } })

        if (!user) resp.status(400).send('Usuário não encontrado')

        //Compara a senha digitada com a senha criptografada no banco
        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if (!isMatch) {
            return resp.status(401).send('Email/Senha inválido.')
        }

        //Payload com token válido por 1 hora
        const now = Math.floor(Date.now() / 1000)
        const payload = {
            id: user.id,
            email: user.email,
            iat: now,
            exp: now + (60 * 60)
        }

        resp.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    //Validação do token
    const validateToken = async (req, resp) => {
        const userData = req.body || null
        try {
            if (userData) {
                const token = jwt.decode(userData.token, authSecret)
                if (new Date(token.exp * 1000) > new Date()) {
                    return resp.send(true)
                }
            }
        }
        catch (error) {
            //problema com token
        }

        resp.send(false)
    }
    return { signin, validateToken }
}