import { logger } from "../logger";
import { getUrl } from "../util";
import { token } from "./constants";

export const fetchRunningPipelines = async (repoSlug: string) => {
  const pipelines = [];
  let nextUrl = getUrl(
    `/repositories/allpointpos-admin/${repoSlug}/pipelines/?pagelen=10`,
  );

  try {
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();

        const inProgressPipelines = result.values.filter(
          (pipeline: any) => pipeline.state.name === "IN_PROGRESS",
        );

        pipelines.push(...inProgressPipelines);

        nextUrl = result.next || null;
      } else {
        logger.error(`Failed to fetch pipelines: ${response.statusText}`);
        break;
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching pipelines: ${error.message}`);
    }
  }

  return pipelines;
};
