'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ratings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ratingUser_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ratingPost_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'posts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ratingComment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add unique indexes
    await queryInterface.addIndex(
      'ratings',
      ['ratingUser_id', 'ratingPost_id'],
      {
        unique: true,
        where: {
          ratingPost_id: {
            [Sequelize.Op.ne]: null,
          },
        },
      }
    );

    await queryInterface.addIndex(
      'ratings',
      ['ratingUser_id', 'ratingComment_id'],
      {
        unique: true,
        where: {
          ratingComment_id: {
            [Sequelize.Op.ne]: null,
          },
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ratings');
  },
};
