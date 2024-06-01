export const userkeys = {
	all: ['user'],
	current: ['current-user'],
	one: (id: string) => [...userkeys.all, id] as const,
};
