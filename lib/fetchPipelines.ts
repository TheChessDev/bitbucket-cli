import { token } from "./constants";
import { logger } from "../logger";
import { getUrl } from "../util";

export const fetchPipelines = async (repoSlug: string) => {
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

        // Map pipeline UUIDs and names
        const pipelineList = result.values.map((pipeline: any) => ({
          uuid: pipeline.uuid,
          state: pipeline.state.name,
          target: pipeline.target.ref_name,
        }));

        pipelines.push(...pipelineList);

        // Handle pagination
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
