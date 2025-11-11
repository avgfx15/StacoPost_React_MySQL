'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // This migration is redundant as the index is already created in the previous migration
    // No action needed
  },

  async down(queryInterface, Sequelize) {
    // No action needed
  },
};
