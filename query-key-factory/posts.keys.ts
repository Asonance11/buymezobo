export const postsKeys = {
	all: ['posts'],
	one: (id: string) => [...postsKeys.all, id] as const,
	fromCreatorName: (name: string) => [...postsKeys.all, name] as const,
	many: (page?: number) => [...postsKeys.all, page ?? 1] as const,
};
