//foi criado usando yarn sequelize migration: create--name = create - meetups

'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('meetups', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false, //não vai ter usuário sem ID
				autoIncrement: true,
				primaryKey: true,
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			localization: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			date: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			user_id: {
				type: Sequelize.INTEGER,
				references: { model: 'users', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
				allowNull: true,
			},
			provider_id: {
				type: Sequelize.INTEGER,
				references: { model: 'users', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
				allowNull: true,
			},
			canceled_at: {
				type: Sequelize.DATE,
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
		return queryInterface.dropTable('meetups');
	},
};
