export const supportsKeys = {
	all: ['supports'],
	one: (id: string) => [...supportsKeys.all, id] as const,
	many: (page?: number) => [...supportsKeys.all, page ?? 1] as const,
};
