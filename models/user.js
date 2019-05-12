'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');

const { userTypes } = require('../constants');

class User extends Model {}
User.init({
  userId: {
    type: DataTypes.UUID,
    field: 'id',
  },
  password: DataTypes.STRING,
  facebookId: {
    type: DataTypes.STRING,
    field: 'facebook_id',
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },
  userType: {
    type: DataTypes.ENUM,
    values: userTypes,
    field: 'user_type',
  },
}, {})

User.beforeCreate(async (user) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    user.userId = uuid();
    user.email = user.email.toLowerCase();
  } catch (err) {
   throw new Error();
  }
});

User.associate = (models) => {
  User.hasMany(models.Company);
  User.hasMany(models.JobSeeker);
  User.hasMany(models.Admin);
};

User.prototype.validPassword = async (password) => {
  return bcrypt.compare(password, this.password);
};
