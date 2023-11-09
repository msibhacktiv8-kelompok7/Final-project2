'use strict';
const {
  Model, SMALLINT
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
      Photo.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Photo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "title harus ada"
        },
        notEmpty: {
          msg: 'title harus diisi'
        }
      }
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "captionya harus ada"
        },
        notEmpty: {
          msg: 'caption harus diisi'
        }
      }
    },
    poster_img_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "link image tidak boleh kosong"
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