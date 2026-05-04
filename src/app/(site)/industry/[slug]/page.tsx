import { TopicTemplate } from "@/components/TopicTemplate";
import { getTopic } from "@/lib/topics";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";

export default async function IndustryTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic("industry", slug);
  const name = `${topic.title.replace(/\.$/, "")}${topic.italic ?? ""}`.trim();
  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Industry", path: "/industry" },
          { name, path: `/industry/${slug}` },
        ])}
      />
      <TopicTemplate topic={topic} />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic("industry", slug);
  return {
    title: `${topic.title.replace(/\.$/, "")}${topic.italic ?? ""} · Industry`,
    description: topic.lede,
    alternates: { canonical: `/industry/${slug}` },
  };
}
