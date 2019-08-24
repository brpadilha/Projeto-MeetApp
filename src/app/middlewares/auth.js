import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';
import { userInfo } from 'os';

export default async (req, res, next) => {
	const autHeader = req.headers.authorization;

	if (!autHeader) {
		return res.status(401).json({ error: 'Token not privided' });
	}
	const [, token] = autHeader.split(' ');

	try {
		const decoded = await promisify(jwt.verify)(token, authConfig.secret);

		req.userId = decoded.id;

		return next();
	} catch (err) {
		return res.status(401).json({ error: 'Token invalid' });
	}
};
