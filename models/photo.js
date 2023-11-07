'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user)
    }
  }
  Photo.init({
    title: DataTypes.STRING,
    caption: DataTypes.STRING,
    poster_img_url: {
      type: DataTypes.STRING,
      validate:{
        notNull: {
          msg: "username tidak boleh kosong"
        },
        isUrl: {
          msg: "Format Url tidak valid"
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};