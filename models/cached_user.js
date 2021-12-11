const Sequelize = require("sequelize");
const sequelize = require("../utils/db");

const CachedUser = sequelize.define("cached_user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
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
  unqiue_id: {
    type: Sequelize.STRING,
  },
});
module.exports = CachedUser;