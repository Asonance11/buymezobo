export const articlesKeys = {
	all: ['articles'],
	one: (id: string) => [...articlesKeys.all, id] as const,
};
