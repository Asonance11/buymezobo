const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Kafka } = require('kafkajs');

const app = express();
const server = http.createServer(app);
const cors = require('cors');

app.use(cors());

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

const kafka = new Kafka({
	brokers: ['localhost:9093'], // Make sure to match your Kafka broker address
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

const run = async () => {
	await consumer.connect();
	await consumer.subscribe({ topic: 'notifications', fromBeginning: true });

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			const notification = JSON.parse(message.value.toString());
			console.log(notification);
			io.to(`user-${notification.userId}`).emit('notification', notification);
			console.log(
				`[4] Received message ${message.value.toString()} in topic ${topic} from partition #${partition}`,
			);
		},
	});
};

run().catch(console.error);

io.on('connection', (socket) => {
	console.log('a user connected');

	let id;

	// Join a room based on user id
	socket.on('join', (userId) => {
		if (userId) {
			id = userId;
			console.log(`a user ${userId} joined`);
			socket.join(`user-${userId}`);
		}
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
		if (id) {
			console.log(`a user ${id} disconnected`);
		}
	});
});

server.listen(3001, () => {
	console.log('listening on *:3001');
});
