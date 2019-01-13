const Sequelize = require('sequelize')
const UserModel = require('./models/User')

const sequelize = new Sequelize('postgres://postgres:123@localhost:5432/desafio')

const User = UserModel(sequelize, Sequelize)

sequelize.sync()
    .then(() => console.log('Tabela criada.'))

module.exports = { User }