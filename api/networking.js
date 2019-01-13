const { User, Meeting } = require('../sequelize')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = app => {

    const getNetwork = async (req, resp) => {
        const users = await User.findAll({ attributes: ['name', 'email', 'role', 'interests'], where: { interests: { [Op.contains]: [req.params.interest] } } })
        let usersFinal = []
        let roles = []
        for (user of users) {
            let role = null
            if (!roles.includes(user.role)) {
                role = user.role
                roles.push(role)
                usersFinal.push(user)
            }
        }

        const meetings = await Meeting.findOne({ where: { [Op.and]: [{ email1: usersFinal[0].email }, { email2: usersFinal[1].email }, { email3: usersFinal[2].email }, { email4: usersFinal[3].email }] } })
        if (!meetings) {
            Meeting.create({
                email1: usersFinal[0].email,
                email2: usersFinal[1].email,
                email3: usersFinal[2].email,
                email4: usersFinal[3].email
            })
                .then(resp.status(200).send(usersFinal.slice(0, 4)))
                .catch(error => resp.status(400).send(error))
        }
        else {
            resp.status(400).send('Reunião já realizada.')
        }
    }

    return { getNetwork }
}