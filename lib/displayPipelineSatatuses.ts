import { logger } from "../logger";
import { fetchRunningPipelines } from "./fetchRunningPipelines";

export const displayPipelineStatuses = async (repoSlug: string) => {
  const pipelines = await fetchRunningPipelines(repoSlug);

  if (pipelines.length === 0) {
    logger.info("No running pipelines found.");
    return;
  }

  logger.info(`Running pipelines for repository: ${repoSlug}`);
  pipelines.forEach((pipeline) => {
    logger.info(`- Pipeline UUID: ${pipeline.uuid}`);
    logger.info(`  Branch: ${pipeline.target.ref_name}`);
    logger.info(`  State: ${pipeline.state.name}`);
    logger.info(`  Started on: ${pipeline.created_on}`);
    logger.info(`  Build number: ${pipeline.build_number}`);
    logger.info("-----------------------------");
  });
};
