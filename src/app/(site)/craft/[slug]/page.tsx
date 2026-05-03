import { TopicTemplate } from "@/components/TopicTemplate";
import { getTopic } from "@/lib/topics";

export default async function CraftTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic("craft", slug);
  return <TopicTemplate topic={topic} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic("craft", slug);
  return {
    title: `${topic.title.replace(/\.$/, "")}${topic.italic ?? ""} · Craft · Huamei`,
    description: topic.lede,
  };
}
