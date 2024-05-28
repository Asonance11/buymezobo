import Bull from 'bull';

const address = 'localhost';

export const notificationQueue = new Bull('notificationQueue', {
    redis: { host: address, port: 6379 },
});
