import User from '../models/User';
import File from '../models/File';

class ProviderController {
	async index(req, res) {
		const providers = await User.findAll({
			where: { provider: true },
			attributes: ['id', 'name', 'email', 'photo_id'],
			include: [
				{ model: File, as: 'photo', attributes: ['name', 'path', 'url'] },
			],
		});
		return res.json(providers);
	}
}

export default new ProviderController();
