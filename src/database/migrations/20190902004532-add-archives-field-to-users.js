'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('users', 'archive_id', {
			type: Sequelize.INTEGER,
			references: { model: 'files', key: 'id' },
			onUpdate: 'CASCADE',
			onDelete: 'SET NULL',
			allowNull: true,
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('users', 'archive_id');
	},
};
