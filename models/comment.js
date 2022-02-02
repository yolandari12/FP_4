'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };
  Comment.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: 'Users',
      referencesKey: 'id'
  },
    photo_id: {
      type: DataTypes.INTEGER,
      references: 'Photos',
      referencesKey: 'id'
    },
    comment:{
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Comment required',
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });

  Comment.associate = (model) => {
    Comment.belongsTo(model.User, {foreignKey: 'user_id', onDelete: 'cascade'});
    Comment.belongsTo(model.Comment, {foreignKey: 'photo_id', onDelete: 'cascade'});
  }

  return Comment;
};
