import inquirer from "inquirer";

export const selectPipeline = async (
  pipelines: { uuid: string; state: string; target: string }[],
) => {
  const { pipelineUuid } = await inquirer.prompt({
    type: "list",
    name: "pipelineUuid",
    message: "Select a pipeline to run:",
    choices: pipelines.map((pipeline) => ({
      name: `${pipeline.target} (State: ${pipeline.state})`,
      value: pipeline.uuid,
    })),
  });

  return pipelineUuid;
};
