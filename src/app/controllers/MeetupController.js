import Meetup from '../models/Meetup';
import User from '../models/User';
import * as Yup from 'yup';

class MeetupController {
	async store(req, res) {
		const schema = Yup.object().shape({
			provider_id: Yup.number().required(),
			title: Yup.string().required(),
			description: Yup.string().required(),
			localization: Yup.string().required(),
			date: Yup.date().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Validation fails' });
		}

		const { provider_id, title, description, localization, date } = req.body;

		const isProvider = await User.findOne({
			where: { id: provider_id, provider: true },
		});

		if (!isProvider) {
			return res
				.status(400)
				.json({ error: 'Only providers can create a meetup' });
		}

		const meetup = await Meetup.create({
			user_id: req.userId,
			provider_id,
			title,
			description,
			localization,
			date,
		});

		return res.json(meetup);
	}
}

export default new MeetupController();
