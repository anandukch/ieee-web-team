const Sequelize = require("sequelize");
const sequelize = require("../utils/db");

const User = sequelize.define("user", {
  user_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone_number:{
    type: Sequelize.STRING,
  },
  alt_email:{
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  // organization: {
  //   name: Sequelize.STRING,
  //   role: Sequelize.STRING,
  //   valid_till: Sequelize.DATE,
  // },
});
module.exports = User;