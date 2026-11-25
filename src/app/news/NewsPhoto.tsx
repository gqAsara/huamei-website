import Image from "next/image";
import type { NewsImage } from "@/lib/news";

type Props = { photo: Pick<NewsImage, "url" | "alt">; split?: boolean; eager?: boolean };

export function NewsPhoto({ photo, split, eager }: Props) {
  return (
    <figure className="news-photo">
      <div className="news-photo-frame">
        <Image
          src={photo.url} alt={photo.alt} fill
          sizes={split ? "(min-width: 820px) 46vw, 92vw" : "(min-width: 910px) 820px, 92vw"}
          loading={eager ? "eager" : "lazy"}
        />
      </div>
      <figcaption>{photo.alt}</figcaption>
    </figure>
  );
}
