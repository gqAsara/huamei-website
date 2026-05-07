"use client";

import { useMemo } from "react";
import { NextStudio } from "next-sanity/studio";
import { buildConfig } from "../../../../sanity.config";

export function Studio({ host }: { host: string }) {
  const config = useMemo(() => {
    const basePath = host.startsWith("studio.") ? "/" : "/studio";
    return buildConfig({ basePath });
  }, [host]);

  return <NextStudio config={config} />;
}
