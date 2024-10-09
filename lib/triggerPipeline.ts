import { token } from "./constants";
import { logger } from "../logger";

export const triggerPipeline = async (
  repoSlug: string,
  pipelineUuid: string,
) => {
  const triggerUrl = `https://api.bitbucket.org/2.0/repositories/allpointpos-admin/${repoSlug}/pipelines/${pipelineUuid}/run`;

  try {
    const response = await fetch(triggerUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      logger.info(`Pipeline ${pipelineUuid} triggered successfully.`);
    } else {
      logger.error(`Failed to trigger pipeline: ${response.statusText}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error triggering pipeline: ${error.message}`);
    }
  }
};
