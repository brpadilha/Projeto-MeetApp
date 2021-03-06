import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import * as Yup from 'yup';
import { pt } from 'date-fns/locale/pt';
import Notification from '../schemas/Notification';
import Mail from '../../lib/Mail';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class MeetupController {
	async index(req, res) {
		const { page } = req.query;

		const meetup = await Meetup.findAll({
			where: {
				canceled_at: null,
			},
			order: ['date'],
			attributes: ['id', 'date', 'title', 'description', 'localization'],
			limit: 10,
			offset: (page - 1) * 10,

			include: [
				{
					model: User,
					as: 'provider',
					attributes: ['id', 'name'],
					include: [
						{
							model: File,
							as: 'photo',
							attributes: ['id', 'path', 'url'],
						},
					],
				},
			],
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

		const user = await User.findByPk(req.userId);

		const formattedDate = format(
			hourStart,
			"'dia' dd 'de' MMMM', às' H:mm'h.",
			{
				locale: pt,
			}
		);

		await Notification.create({
			content: `Novo agendamento de ${user.name}, para o dia ${formattedDate}`,
			user: provider_id,
		});

		return res.json(meetup);
	}
	async delete(req, res) {
		const meetup = await Meetup.findByPk(req.params.id, {
			include: [
				{
					model: User,
					as: 'provider',
					attributes: ['name', 'email'],
				},
				{
					model: User,
					as: 'user',
					attributes: ['name'],
				},
			],
		});

		if (meetup.user_id !== req.userId) {
			return res.status(401).json({
				error: 'You don`t have permission to cancel this meetup',
			});
		}
		const dateWithHour = subHours(Meetup.date, 2);

		if (isBefore(dateWithHour, new Date())) {
			return res
				.status(401)
				.json({ error: 'You can only cancel meetups 2 hour to advance.' });
		}

		meetup.canceled_at = new Date();
		await meetup.save();
		await Queue.add(CancellationMail.key, {
			meetup,
		});
		return res.json(meetup);
	}
}

export default new MeetupController();
