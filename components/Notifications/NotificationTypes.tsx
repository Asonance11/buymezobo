import { getSupportbyId } from '@/actions/support';
import { getUserbyId } from '@/lib/authentication';
import { helvetica } from '@/utility/fonts';
import { Notification, Support } from '@prisma/client';
import { User } from 'lucia';
import { Link } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaHandSparkles } from 'react-icons/fa6';
import { toast } from 'sonner';

export const renderNotificationComponent = (notification: Notification) => {
	switch (notification.type) {
		case 'Welcome':
			return <WelcomeNotification notification={notification} />;
		case 'BoughtZobo':
			//return buymeZoboText({ notification });
			return <BoughtZoboNotification notification={notification} />;
		default:
			return null;
	}
};

interface NotificationProps {
	notification: Notification;
}

const WelcomeNotification = ({ notification }: NotificationProps) => {
	//console.log(notification);
	return (
		<div className="flex bg-white p-2 items-center gap-1 w-full">
			<FaHandSparkles className="animate-bounce duration-300 text-black text-xl " />
			<p className={` ${helvetica.className} font-bold -tracking-wide text-black`}>Welcome to Buymezobo</p>
		</div>
	);
};

const BoughtZoboNotification = ({ notification }: NotificationProps) => {
	const [support, setSupport] = useState<Support | null>(null);

	useEffect(() => {
		const fetchSupport = async () => {
			const support = await getSupportbyId(notification.resourceId);
			setSupport(support);
		};
		fetchSupport();
	}, [notification.resourceId]);
	if (!support) {
		return null;
	}
	return (
		<div className="flex ">
			<div></div>
			<div className="flex-1">
				<p>
					{support.name} bought you {support.numberOfZobo} zobo
				</p>
				<p className="font-light">{support.content}</p>
			</div>
		</div>
	);
};
