import { Command } from "commander";
import inquirer from "inquirer";
import inquirerAutocompletePrompt from "inquirer-autocomplete-prompt";
import { runPipeline } from "./commands/runPipeline";
import { runClone } from "./commands/runClone";
import { createPipeline } from "./commands/createPipeline";
import { runPipelineStatus } from "./commands/runPipelineStatus";

inquirer.registerPrompt("autocomplete", inquirerAutocompletePrompt);

const program = new Command();
program
  .command("clone")
  .description("Clone a Bitbucket repository")
  .action(runClone);

program
  .command("run-pipeline")
  .description("Run a pipeline in a Bitbucket repository")
  .action(runPipeline);

program
  .command("create-pipeline")
  .description(
    "Create a pipeline in a Bitbucket repository for a specific branch",
  )
  .action(createPipeline);

program
  .command("pipeline-status")
  .description("Get the status of running pipelines in a Bitbucket repository")
  .action(runPipelineStatus);

program.parse(process.argv);
