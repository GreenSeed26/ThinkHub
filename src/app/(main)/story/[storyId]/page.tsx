import React from "react";
import Story from "./Story";
interface PageParams {
  params: Promise<{ storyId: string }>;
}
export default async function ViewStories({ params }: PageParams) {
  const { storyId } = await params;
  return <Story storyId={storyId} />;
}
