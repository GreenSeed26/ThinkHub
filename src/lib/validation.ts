import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required*");

export const signUpSchema = z.object({
  email: requiredString,
  username: requiredString.regex(
    /^[a-zA-Z0-09_-]+$/,
    "Only letter, numbers, '-', and '_' is allowed",
  ),
  password: requiredString.min(8, "password must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: requiredString,
  password: requiredString.min(8, "password must be at least 8 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const postSchema = z.object({
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export type PostValues = z.infer<typeof postSchema>;

export const storySchema = z.object({
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export type StoryValues = z.infer<typeof storySchema>;

export const updateProfileSchema = z.object({
  displayName: z.string(),
  bio: z.string().max(101, "maximum of 101 characters exceeded"),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

export const createGroupSchema = z.object({
  name: requiredString,
  description: requiredString,
  privacy: z.enum(["PUBLIC", "PRIVATE"]),
});

export type CreateGroupValues = z.infer<typeof createGroupSchema>;

export const updateGroupProfileSchema = z.object({
  name: z.string(),
  description: z.string().max(101, "maximum of 101 characters exceeded"),
});
export type UpdateGroupProfileValues = z.infer<typeof updateGroupProfileSchema>;

export const createCommentSchema = z.object({
  content: requiredString,
});
