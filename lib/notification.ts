import { Notification, PrismaClient } from '@prisma/client';
import { Kafka } from 'kafkajs';
import { db } from './database';
import { Optional } from '@prisma/client/runtime/library';

const kafka = new Kafka({
    //clientId: 'your-client-id',
    brokers: ['localhost:9092'], // Make sure to match your Kafka broker address
});

const producer = kafka.producer();

interface CreateNotificationParams extends Optional<Notification> { }

export async function createNotification({
    type,
    userId,
    senderId,
    resourceId,
}: CreateNotificationParams): Promise<Notification | null> {
    // Create notification in the database
    try {
        const notification = await db.notification.create({
            data: {
                type: type!,
                senderId: senderId,
                userId: userId!,
                resourceId: resourceId!,
            },
        });

        // Send notification to Kafka
        await producer.connect();
        await producer.send({
            topic: 'notifications',
            messages: [{ key: String(notification.userId), value: JSON.stringify(notification) }],
        });

        console.log('Event sent to Kafka successfully');
        await producer.disconnect();

        return notification;
    } catch (error) {
        console.log(error);
        return null;
    }
}
