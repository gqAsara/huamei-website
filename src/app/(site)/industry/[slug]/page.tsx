import { TopicTemplate } from "@/components/TopicTemplate";
import { getTopic } from "@/lib/topics";

export default async function IndustryTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic("industry", slug);
  return <TopicTemplate topic={topic} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic("industry", slug);
  return {
    title: `${topic.title.replace(/\.$/, "")}${topic.italic ?? ""} · Industry · Huamei`,
    description: topic.lede,
  };
}
