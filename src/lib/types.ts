import { $Enums, Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    image: true,
    banner: true,
    email: true,
    username: true,
    displayName: true,
    createdAt: true,
    bio: true,
    group: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    group: {
      include: getGroupDataInclude(loggedInUserId),
    },
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
        reaction: true,
      },
    },
    attachments: true,
    bookmark: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

export function getStoryDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    media: {
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    },
  } satisfies Prisma.StoryInclude;
}

export type StoryData = Prisma.StoryGetPayload<{
  include: ReturnType<typeof getStoryDataInclude>;
}>;

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export function getGroupDataInclude(loggedInUserId: string) {
  return {
    members: {
      include: {
        user: { select: getUserDataSelect(loggedInUserId) },
      },
      orderBy: { joinedAt: "desc" },
    },
    joinRequests: {
      where: { userId: loggedInUserId },
    },
    _count: {
      select: {
        members: true,
        joinRequests: true,
      },
    },
  } satisfies Prisma.GroupInclude;
}

export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      image: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export function getJoinRequestDataSelect(loggedInUserId: string) {
  return {
    id: true,
    groupId: true,
    userId: true,
    status: true,
    createdAt: true,
    user: { select: getUserDataSelect(loggedInUserId) },
  } satisfies Prisma.JoinRequestSelect;
}

export type JoinRequestData = Prisma.JoinRequestGetPayload<{
  select: ReturnType<typeof getJoinRequestDataSelect>;
}>;

export type GroupData = Prisma.GroupGetPayload<{
  include: ReturnType<typeof getGroupDataInclude>;
}>;

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export type PostPage = {
  posts: PostData[];
  nextCursor: string | null;
};
export type StoryPage = {
  stories: StoryData[];
  nextCursor: string | null;
};

export type FollowInfo = {
  followers: number;
  isFollowedByUser: boolean;
};

export type LikeInfo = {
  likes: number;
  isLikedByUser: boolean;
  reaction: $Enums.ReactionType | null;
  reactions: Record<$Enums.ReactionType, number>;
};

export type CommentsPage = {
  comments: CommentData[];
  nextCursor: string | null;
};

export type BookmarkInfo = {
  isBookmarkedByUser: boolean;
};

export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface NotificationCountInfo {
  unreadCount: number;
}

export type DiscoverGroupPage = {
  groups: GroupData[];
  nextCursor: string | null;
};

export type JoinInfo = {
  isJoined: boolean;
};
export type RequestInfo = {
  requests: JoinRequestData[];
};

export type ApprovalInfo = {
  isApproved: boolean;
};
