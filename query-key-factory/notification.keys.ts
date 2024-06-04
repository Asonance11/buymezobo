export const notificationKeys = {
	all: ['notifications'],
	one: (id: string) => [...notificationKeys.all, id] as const,
	many: (page?: number) => [...notificationKeys.all, page ?? 1] as const,
};
