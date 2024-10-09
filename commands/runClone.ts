import Fuse from "fuse.js";
import { fetchRepositories } from "../lib/fetchRepositories";
import { cloneRepository } from "../lib/cloneRepository";
import inquirer from "inquirer";
import { logger } from "../logger";

export const runClone = async () => {
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

  const { folderName } = await inquirer.prompt({
    type: "input",
    name: "folderName",
    message: "Enter a name for the folder:",
    default: repoName,
  });

  await cloneRepository(repoName, selectedRepo.sshUrl, folderName);
};
