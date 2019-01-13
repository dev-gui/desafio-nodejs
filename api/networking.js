const { User } = require('../sequelize')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = app => {

    const getNetwork = async (req, resp) => {
        const users = await User.findAll({ attributes: ['name', 'email', 'role', 'interests'], where: { interests: { [Op.contains]: [req.params.interest] } } })

        users.filter
    }

    return { getNetwork }
}