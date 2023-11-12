'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Photo)
      this.hasOne(models.Comment)
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "full name tidak boleh kosong"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: "email sudah terdaftar"
      },
      allowNull:false,
      validate: {
        notNull: {
          msg: "email tidak boleh kosong"
        },
        isEmail: {
          msg: "format email tidak valid"
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: {
        msg: "username telah digunakan"
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: "username tidak boleh kosong"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "password tidak boleh kosong"
        }
      }
    },
    profile_image_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "profile tidak boleh kosong"
        },
        isUrl: {
          msg: "url image tidak valid"
        }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          msg: "umur harus diisi dengan angka"
        }
      }
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    scopes: {
      withoutPassword: {
        attributes: {
          exclude: ['password']
      }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};