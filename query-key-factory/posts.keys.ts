export const postsKeys = {
	all: ['posts'],
	one: (id: string) => [...postsKeys.all, id] as const,
	many: (page?: number) => [...postsKeys.all, page ?? 1] as const,
};
