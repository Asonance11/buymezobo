import { Post, Support as SupportType, Comment as CommentType, Profile } from '@prisma/client';

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
	comments?: Comment[];
	supporter?: Profile;
	profile?: Profile;
}
