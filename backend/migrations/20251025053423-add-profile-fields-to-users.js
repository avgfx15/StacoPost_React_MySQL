'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // This migration is redundant as the columns are added in the next migration
    // No action needed
  },

  async down(queryInterface, Sequelize) {
    // No action needed
  },
};
