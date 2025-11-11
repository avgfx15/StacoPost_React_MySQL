'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'sessions',
      {
        sid: {
          type: Sequelize.STRING,
          primaryKey: true,
        },
        sess: {
          type: Sequelize.JSON,
          allowNull: false,
        },
        expire: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        indexes: [
          {
            fields: ['expire'],
          },
        ],
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sessions');
  },
};
