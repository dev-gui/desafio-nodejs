module.exports = (sequelize, Sequelize) => {
    const Meeting = sequelize.define('meeting', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email1: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email2: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email3: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email4: {
            type: Sequelize.STRING,
            allowNull: true
        }
    })

    return Meeting
}