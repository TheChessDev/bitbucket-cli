import ora from "ora";
import path from "path";
import simpleGit from "simple-git";
import { CLONE_PATH } from "./constants";
import { logger } from "../logger";

const git = simpleGit();

// Clone repository with progress indicator
export const cloneRepository = async (
  repoName: string,
  sshUrl: string,
  folderName: string,
) => {
  const spinner = ora(`Cloning repository ${repoName}...`).start();
  const targetPath = path.join(CLONE_PATH, folderName);

  try {
    // Show progress during cloning
    await git.clone(sshUrl, targetPath, [], (err, _result) => {
      if (err) {
        spinner.fail(`Error cloning repository: ${err.message}`);
        logger.error(err.message);
      } else {
        spinner.succeed(
          `Repository ${repoName} cloned successfully into ${targetPath}.`,
        );
        logger.info(`Repository ${repoName} cloned into ${targetPath}`);
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      spinner.fail(`Error cloning repository: ${error.message}`);
      logger.error(`Error cloning repository: ${error.message}`);
    }
  }
};
