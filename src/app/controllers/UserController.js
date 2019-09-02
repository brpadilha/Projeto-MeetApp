import * as Yup from 'yup'; //pq a biblioteca yup nao tem um exports
import User from '../models/User';

class UserController {
	async store(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string().required(),
			email: Yup.string()
				.email()
				.required(),
			password: Yup.string()
				.required()
				.min(6), //mínimo de 6 digitos
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Validation fails' });
		}

		const userExists = await User.findOne({ where: { email: req.body.email } }); //pegar as requisiçoes do email

		if (userExists) {
			return res.status(400).json({ error: 'User already exists' });
		}
		const { id, name, email, organizer } = await User.create(req.body);

		return res.json({
			id,
			name,
			email,
			organizer,
		});
	}

	async update(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string(),
			email: Yup.string().email(),
			oldPassword: Yup.string().min(6), //mínimo de 6 digitos
			password: Yup.string()
				.min(6)
				.when(
					'oldPassword',
					(oldPassword, field) => (oldPassword ? field.required() : field) //Se a variável oldPassword estiver preenchida, o field será required, senão, volta ser igual ante
				),
			confirmPassword: Yup.string().when('password', (password, field) =>
				password ? field.required().oneOf([Yup.ref('password')]) : field
			),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Validation fails' });
		}

		const { email, oldPassword } = req.body;

		const user = await User.findByPk(req.userId);

		if (email !== user.email) {
			const userExists = await User.findOne({ where: { email } });

			if (userExists) {
				return res.status(400).json({ error: 'User already exists' });
			}
		}

		if (oldPassword && !(await user.checkPassword(oldPassword))) {
			return res.status(401).json({ error: 'Password does not match' });
		}

		const { id, name, organizer } = await user.update(req.body);

		return res.json({
			id,
			name,
			email,
			organizer,
		});
	}
}

export default new UserController();
