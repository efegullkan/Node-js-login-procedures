const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Role = sequelize.define("role", {
    roleName: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Role;