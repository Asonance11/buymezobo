import Bull from 'bull';

const address = 'redis';

export const notificationQueue = new Bull('notificationQueue', {
	redis: { host: address, port: 6379 },
});
