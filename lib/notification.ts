import { Notification, NotificationType, PrismaClient } from '@prisma/client';
import { Kafka } from 'kafkajs';
import { db } from './database';
import { notificationQueue } from './bullQueue';

/*
one would like to ask me wtf does this file do siji, wtaf does this file do, and i'm gonna explain it here,
this file is just for triggering in app real time notificactions.

some concerns first, real time notifications are cool, even notifications are actually cool too, i love em.
we didn't use push notification from the browser, because those ones are annoying and i hate them, everyone i know that uses them hate them
so we implemented in app real time notifications.

first of all we needed to make triggering the notification be a background task, we don't need to wait for that to clock, infact, it dosent make any sense that we wait for it
so we are triggering the notification as a background task instead of awaiting it, and we are doing this with bull https://optimalbits.github.io/bull/ 

another issue was then how to implement real time notifications, services take about $250 a month just for this, that's insane, so we did something cool and local.

what we do from this file is actually very simple, we needed to push our notification after creating it in the db, to the kafka broker, via the producer and that's all that is in this file.

now the kafka broker can't push automatically to the consumer, so we use a separate express server to get the notificaction and send it back to us with socket.io in eral time, this is one of the simplest methods i've seen, but we'll keep pushing.

i'm still looking for methods to make this simpler, and i hope i find, sometimes i get cons=fused already with wtf is happening
so for a simple reference

triggerNotification -> background task to create notification -> kafka broker via the producer -> socket express server -> back to us via the socket in the NotificationProvider for the sonners.

this is for the real time notifications, when users want to see all their notifications, it will manually query the notifications from the meeting
*/

// INFO: this interface will continue to grow as the function to createe a function get's even larger
interface CreateNotificationParams {
	type: NotificationType;
	senderId: string | null;
	userId: string;
	resourceId: string;
	content: string | null;
}

// INFO: Main function to trigger notificactions ------------------------------

//NOTE: not an async function so we don't need to await it
export function triggerNotification(data: CreateNotificationParams) {
	notificationQueue.add(data); // NOTE: add to the notification queue
	console.log(' [2] Notification job added to queue:', data);
}

// INFO: Bull for background tasks ------------------------------
notificationQueue.process(async (job) => {
	const { data } = job;
	await createNotification(data); //NOTE: call the createNotification method
});

// INFO: kafka configuration ------------------------------

const kafka = new Kafka({
	brokers: ['localhost:9092'], //NOTE: ikafka instantiation
});

const producer = kafka.producer(); //NOTE: get our producer

// INFO: create notification function and send to kafka broker ------------------------------

export async function createNotification({
	type,
	userId,
	senderId,
	resourceId,
	content,
}: CreateNotificationParams): Promise<Notification | null> {
	// Create notification in the database
	try {
		const notification = await db.notification.create({
			data: {
				type: type!,
				senderId: senderId,
				userId: userId!,
				resourceId: resourceId!,
				content: content,
			},
		});

		// Send notification to Kafka
		await producer.connect();
		await producer.send({
			topic: 'notifications',
			messages: [{ key: String(notification.userId), value: JSON.stringify(notification) }],
		});

		console.log('[3] Event sent to Kafka successfully');
		await producer.disconnect();

		return notification;
	} catch (error) {
		console.log(error);
		return null;
	}
}
