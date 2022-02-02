'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SocialMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SocialMedia.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name required',
        }
      }
    },
    social_media_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Social media required'
        },
        isUrl: {
          msg: 'Social media invalid'
        }
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: 'Users',
      referencesKey: 'id'
    }
  }, {
    sequelize,
    modelName: 'SocialMedia',
  });

  SocialMedia.associate = (model) => {
    SocialMedia.belongsTo(model.User, {foreignKey: 'user_id', foreignKeyConstraint: true, onDelete: 'cascade', hooks: true})
  }

  return SocialMedia;
};
