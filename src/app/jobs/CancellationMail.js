import Mail from '../../lib/Mail';
import pt from 'date-fns/locale/pt';

class CancellationMail {
	get key() {
		return 'CancellationMail';
	}

	async handle({ data }) {
		const { meetup } = data;
		Mail.sendMail({
			to: `${meetup.provider.name} <${meetup.provider.email}>`,
			subject: 'Agendamento para meetup cancelado',
			template: 'cancelation',
			context: {
				provider: meetup.provider.name,
				user: meetup.user.name,
				date: format(meetup.date, "'dia' dd 'de' MMMM', às' H:mm'h", {
					locale: pt,
				}),
			},
		});
	}
}

export default new CancellationMail();
