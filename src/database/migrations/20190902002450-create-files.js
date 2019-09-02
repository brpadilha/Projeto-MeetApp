//foi criado usando yarn sequelize migration: create--name = create - files

'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('files', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false, //não vai ter usuário sem ID
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false, //não vai ter usuário sem nome
			},
			path: {
				type: Sequelize.STRING,
				allowNull: false, //não vai ter usuário sem email
				unique: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},

	down: queryInterface => {
		return queryInterface.dropTable('files');
	},
};
