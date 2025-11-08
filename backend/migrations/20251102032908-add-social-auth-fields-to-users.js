'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'googleId', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('users', 'facebookId', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('users', 'linkedinId', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('users', 'provider', {
      type: Sequelize.ENUM('local', 'google', 'facebook', 'linkedin'),
      defaultValue: 'local',
      allowNull: false,
    });
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: true, // Allow null for social logins
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'googleId');
    await queryInterface.removeColumn('users', 'facebookId');
    await queryInterface.removeColumn('users', 'linkedinId');
    await queryInterface.removeColumn('users', 'provider');
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },
};
