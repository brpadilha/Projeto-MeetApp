import Meetup from '../models/Meetup';
import User from '../models/User';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import * as Yup from 'yup';

class MeetupController {
	async index(req, res) {
		const meetup = await Meetup.findAll({
			where: {
				canceled_at: null,
			},
		});
		return res.json(meetup);
	}
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

		const hourStart = startOfHour(parseISO(date));

		if (isBefore(hourStart, new Date())) {
			return res.status(400).json({ error: 'Past dates are not permited' });
		}

		const checkAvailability = await Meetup.findOne({
			where: {
				provider_id,
				canceled_at: null,
				date: hourStart,
			},
		});

		if (checkAvailability) {
			return res.status(400).json({ error: 'Meetup date is not available' });
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
