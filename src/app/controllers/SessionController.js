import User from '../models/User';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import * as Yup from 'yup';

class SessionController {
	async store(req, res) {
		const schema = Yup.object().shape({
			email: Yup.string()
				.email()
				.required(),
			password: Yup.string().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Validation fails' });
		}

		const { email, password } = req.body;

		const user = await User.findOne({ where: { email } });

		if (!user) {
			//se usuário não existe

			return res.status(401).json({ error: 'User not found' });
		}

		if (!(await user.checkPassword(password))) {
			//se a senha NÃO bater na verificação dentro do User.js
			return res.status(401).json({ error: 'Password does not match' });
		}
		const { id, name } = user;

		return res.json({
			user: {
				id,
				name,
				email,
			},
			token: jwt.sign({ id }, authConfig.secret, {
				expiresIn: authConfig.expiresIn,
			}), //id é o payload, //gobarberrocketseat
		});
	}
}

export default new SessionController();
