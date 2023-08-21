'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Collections', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      materialId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Materials', // Nombre de la tabla
          key: 'id', // Columna referenciada
        },
        onDelete: 'CASCADE',
      },
      quantityCollected: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      collectionDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Collections');
  }
};