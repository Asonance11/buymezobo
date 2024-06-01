export const userkeys = {
	all: ['user'],
	current: () => [...userkeys.all, 'current-user'] as const,
	getByName: (name: string) => [...userkeys.all, name] as const,
	one: (id: string) => [...userkeys.all, id] as const,
};
