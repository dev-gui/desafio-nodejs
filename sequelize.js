const Sequelize = require('sequelize')
const UserModel = require('./models/User')
const MeetingModel = require('./models/Meeting')

const sequelize = new Sequelize('postgres://postgres:123@localhost:5432/desafio')

const Meeting = MeetingModel(sequelize, Sequelize)
const User = UserModel(sequelize, Sequelize)

sequelize.sync()
    .then(() => console.log('Tabelas criadas.'))

module.exports = { User, Meeting }