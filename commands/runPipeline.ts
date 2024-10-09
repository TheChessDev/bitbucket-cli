import inquirer from "inquirer";
import { fetchPipelines } from "../lib/fetchPipelines";
import { logger } from "../logger";
import { selectPipeline } from "../lib/selectPipeline";
import { triggerPipeline } from "../lib/triggerPipeline";
import Fuse from "fuse.js";
import { fetchRepositories } from "../lib/fetchRepositories";

export const runPipeline = async () => {
  const repositories = await fetchRepositories();
  const fuse = new Fuse(repositories, { keys: ["name"], threshold: 0.3 });

  const { repoName } = await inquirer.prompt({
    // @ts-expect-error invalid value
    type: "autocomplete",
    name: "repoName",
    message: "Enter repository name:",
    source: async (_answersSoFar: any, input: string) => {
      if (!input)
        return repositories.map((repo: { name: string }) => repo.name);
      return fuse.search(input).map((result: any) => result.item.name);
    },
  });

  const selectedRepo = repositories.find(
    (repo: { name: string }) => repo.name === repoName,
  );
  if (!selectedRepo) {
    logger.error("Selected repository not found");
    return;
  }

  const pipelines = await fetchPipelines(selectedRepo.name);
  if (pipelines.length === 0) {
    logger.warn(`No pipelines found for repository: ${repoName}`);
    return;
  }

  const pipelineUuid = await selectPipeline(pipelines);

  await triggerPipeline(selectedRepo.name, pipelineUuid);
};
