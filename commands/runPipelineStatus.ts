import Fuse from "fuse.js";
import { fetchRepositories } from "../lib/fetchRepositories";
import inquirer from "inquirer";
import { logger } from "../logger";
import { displayPipelineStatuses } from "../lib/displayPipelineSatatuses";

export const runPipelineStatus = async () => {
  const repositories = await fetchRepositories();
  const fuse = new Fuse(repositories, { keys: ["name"], threshold: 0.3 });

  const { repoName } = await inquirer.prompt({
    // @ts-expect-error invalid value
    type: "autocomplete",
    name: "repoName",
    message: "Enter repository name:",
    source: async (_answersSoFar: any, input: string) => {
      if (!input) return repositories.map((repo: { name: any }) => repo.name);
      return fuse.search(input).map((result: any) => result.item.name);
    },
  });

  const selectedRepo = repositories.find(
    (repo: { name: any }) => repo.name === repoName,
  );
  if (!selectedRepo) {
    logger.error("Selected repository not found");
    return;
  }

  await displayPipelineStatuses(selectedRepo.name);
};
