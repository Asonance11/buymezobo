import { Post, Support as SupportType, Comment as CommentType, Profile, Article } from '@prisma/client';

export interface ArticlePrimitive extends Article {
    profile:Profile,
	comments?: CommentPrimitive[];
}

export interface ProfilePrimitive extends Profile {
	posts?: PostPrimitive[];
	support?: SupportPrimitive[];
	supportReceived?: SupportPrimitive[];
	comments?: CommentPrimitive[];
}

export interface PostPrimitive extends Post {
	profile: Profile;
}

export interface CommentPrimitive extends CommentType {
	profile: Profile;
}

export interface SupportPrimitive extends SupportType {
	comments?: CommentPrimitive[];
	supporter?: Profile;
	profile?: Profile;
}
