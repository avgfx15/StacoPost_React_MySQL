'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'mobileNo', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'gender', {
      type: Sequelize.ENUM('male', 'female', 'other'),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'age', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'facebook', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'linkedin', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'instagram', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'mobileNo');
    await queryInterface.removeColumn('users', 'gender');
    await queryInterface.removeColumn('users', 'age');
    await queryInterface.removeColumn('users', 'facebook');
    await queryInterface.removeColumn('users', 'linkedin');
    await queryInterface.removeColumn('users', 'instagram');
  },
};
