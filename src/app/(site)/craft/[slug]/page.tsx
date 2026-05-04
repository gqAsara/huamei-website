import { TopicTemplate } from "@/components/TopicTemplate";
import { getTopic } from "@/lib/topics";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import { craftProduct } from "@/lib/schema/product";

export default async function CraftTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic("craft", slug);
  const name = `${topic.title.replace(/\.$/, "")}${topic.italic ?? ""}`.trim();
  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Craft", path: "/craft" },
          { name, path: `/craft/${slug}` },
        ])}
      />
      <JsonLd
        data={craftProduct({
          slug,
          name,
          description: topic.lede,
          image: topic.heroImage,
        })}
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
  const topic = getTopic("craft", slug);
  return {
    title: `${topic.title.replace(/\.$/, "")}${topic.italic ?? ""} · Craft`,
    description: topic.lede,
    alternates: { canonical: `/craft/${slug}` },
  };
}
