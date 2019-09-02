import User from '../models/User';
import File from '../models/File';

class ProviderController {
	async index(req, res) {
		const providers = await User.findAll({
			where: { provider: true },
			attributes: ['id', 'name', 'email', 'archive_id'],
			include: [
				{ model: File, as: 'archive', attributes: ['name', 'path', 'url'] },
			],
		});
		return res.json(providers);
	}
}

export default new ProviderController();
