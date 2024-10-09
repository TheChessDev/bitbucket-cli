import { token } from "./constants";
import { logger } from "../logger";
import { getUrl } from "../util";

export const triggerPipelineForBranch = async (
  repoSlug: string,
  branchName: string,
) => {
  const triggerUrl = getUrl(
    `/repositories/allpointpos-admin/${repoSlug}/pipelines/`,
  );

  try {
    const response = await fetch(triggerUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: {
          ref_type: "branch",
          ref_name: branchName,
          selector: {
            pattern: "master",
            type: "branches",
          },
          type: "pipeline_ref_target",
        },
      }),
    });

    if (response.ok) {
      logger.info(`Pipeline for branch ${branchName} triggered successfully.`);
    } else {
      logger.error(`Failed to trigger pipeline: ${response.statusText}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error triggering pipeline: ${error.message}`);
    }
  }
};
