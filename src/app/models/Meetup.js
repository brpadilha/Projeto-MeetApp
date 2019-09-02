import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
	static init(sequelize) {
		super.init(
			{
				title: Sequelize.STRING,
				description: Sequelize.STRING,
				localization: Sequelize.STRING,
				date: Sequelize.DATE,
				path: Sequelize.STRING,
				url: {
					type: Sequelize.VIRTUAL,
					get() {
						return `http://localhost:3333/files/${this.path}`;
					},
				},
			},
			{
				sequelize,
			}
		);
		return this;
	}
	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
		this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
	}
}

export default Meetup;
