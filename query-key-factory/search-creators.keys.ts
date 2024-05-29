export const searchCreatorsKeys = {
	all: ['search-creators'],
	one: (id: string) => [...searchCreatorsKeys.all, id] as const,
};
