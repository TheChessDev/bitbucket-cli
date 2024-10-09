import inquirer from "inquirer";
import { fetchBranches } from "../lib/fetchBranches";
import { logger } from "../logger";
import { selectBranch } from "../lib/selectBranch";
import Fuse from "fuse.js";
import { fetchRepositories } from "../lib/fetchRepositories";
import { triggerPipelineForBranch } from "../lib/triggerPipelineForBranch";

export const createPipeline = async () => {
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

  // Step 2: Fetch and select a branch
  const branches = await fetchBranches(selectedRepo.name);
  if (branches.length === 0) {
    logger.warn(`No branches found for repository: ${repoName}`);
    return;
  }

  const branchName = await selectBranch(branches);

  await triggerPipelineForBranch(selectedRepo.name, branchName);
};
