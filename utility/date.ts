import moment from 'moment';

export function formatDate(dateString: Date, formatString?: string) {
	return moment(dateString).format(formatString ? formatString : 'MMMM Do YYYY');
}

export function getTimeOfDay(currentDate: Date) {
	const hour = moment(currentDate).hour();

	if (hour >= 5 && hour < 12) {
		return 'morning';
	} else if (hour >= 12 && hour < 17) {
		return 'afternoon';
	} else if (hour >= 17 && hour < 21) {
		return 'evening';
	} else {
		return 'evening';
	}
}
