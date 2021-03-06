import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
	static init(sequelize) {
		super.init(
			{
				title: Sequelize.STRING,
				description: Sequelize.STRING,
				localization: Sequelize.STRING,
				date: Sequelize.DATE,
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
		this.belongsTo(models.File, { foreignKey: 'archive_id', as: 'archive' });
	}
}

export default Meetup;
