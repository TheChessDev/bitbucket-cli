import { Command } from "commander";
import inquirer from "inquirer";
import simpleGit from "simple-git";
import Fuse from "fuse.js";
import inquirerAutocompletePrompt from "inquirer-autocomplete-prompt";
import path from "path";
import os from "os";

inquirer.registerPrompt("autocomplete", inquirerAutocompletePrompt); // Register autocomplete prompt

const BITBUCKET_API_BASE_URL =
  "https://api.bitbucket.org/2.0/repositories/allpointpos-admin";
const token = process.env.BITBUCKET_ACCESS_TOKEN;
const git = simpleGit();

// Retrieve the clone path from the .env file and resolve it to an absolute path
const CLONE_PATH = path.resolve(
  os.homedir(),
  process.env.CLONE_PATH || "./workspace",
);

// Function to fetch all repositories (with pagination) and map repo names to SSH URLs
const fetchRepositories = async () => {
  const repositories: { name: string; sshUrl: string }[] = [];
  let nextUrl = `${BITBUCKET_API_BASE_URL}?pagelen=100`;

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

        // Map repo names to SSH URLs directly
        const repos = result.values.map((repo: any) => {
          const sshUrl = repo.links.clone.find(
            (link: any) => link.name === "ssh",
          ).href;
          return {
            name: repo.name,
            sshUrl: sshUrl,
          };
        });

        repositories.push(...repos);

        // Handle pagination
        nextUrl = result.next || null; // Continue if there's a next page
      } else {
        console.error("Failed to fetch repositories:", response.statusText);
        break;
      }
    }
  } catch (error) {
    console.error("Error fetching repositories:", error);
  }

  return repositories;
};

// Function to clone the selected repository using SSH URL
const cloneRepository = async (
  repoName: string,
  sshUrl: string,
  folderName: string,
) => {
  try {
    // Safely combine the CLONE_PATH with the folderName
    const targetPath = path.join(CLONE_PATH, folderName);

    // Clone the repository using the SSH URL
    await git.clone(sshUrl, targetPath);
    console.log(`Repository ${repoName} cloned into ${targetPath} using SSH.`);
  } catch (error) {
    console.error("Error cloning repository:", error);
  }
};

// Main CLI logic for selecting and cloning a repository
const run = async () => {
  const repositories = await fetchRepositories();

  // Initialize Fuse.js for fuzzy search on repository names
  const fuse = new Fuse(repositories, { keys: ["name"], threshold: 0.3 });

  // Prompt for repository name with autocompletion
  const { repoName } = await inquirer.prompt({
    type: "autocomplete",
    name: "repoName",
    message: "Enter repository name:",
    source: async (_answersSoFar: any, input: string) => {
      if (!input) return repositories.map((repo) => repo.name);
      return fuse.search(input).map((result: any) => result.item.name);
    },
  });

  // Find the selected repository's SSH URL
  const selectedRepo = repositories.find((repo) => repo.name === repoName);

  if (!selectedRepo) {
    console.error("Selected repository not found");
    return;
  }

  // Prompt for folder name
  const { folderName } = await inquirer.prompt({
    type: "input",
    name: "folderName",
    message: "Enter a name for the folder:",
    default: repoName, // Default to the repo name
  });

  // Clone the selected repository
  await cloneRepository(repoName, selectedRepo.sshUrl, folderName);
};

// Register the CLI command using Commander.js
const program = new Command();
program
  .command("clone")
  .description("Clone a Bitbucket repository")
  .action(run);

program.parse(process.argv);
