//foi criado usando yarn sequelize migration: create--name = create - users

'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('users', {
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
			email: {
				type: Sequelize.STRING,
				allowNull: false, //não vai ter usuário sem email
				unique: true,
			},
			password_hash: {
				type: Sequelize.STRING,
				allowNull: false, //não vai ter usuário sem senha
			},
			provider: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false,
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
		return queryInterface.dropTable('users');
	},
};
