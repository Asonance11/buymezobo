export const commentsKeys = {
	all: ['comments'],
	byArticle: (articleId: string) => [...commentsKeys.all, articleId] as const,
};
