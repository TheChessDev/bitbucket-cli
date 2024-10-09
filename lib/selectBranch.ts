import Fuse from "fuse.js";
import inquirer from "inquirer";

export const selectBranch = async (branches: { name: string }[]) => {
  const fuse = new Fuse(branches, { keys: ["name"], threshold: 0.3 });
  const { branchName } = await inquirer.prompt({
    // @ts-expect-error invalid value
    type: "autocomplete",
    name: "branchName",
    message: "Enter a branch name to trigger the pipeline:",
    source: async (_answersSoFar: any, input: string) => {
      if (!input) return branches.map((branch: { name: any }) => branch.name);
      return fuse.search(input).map((result: any) => result.item.name);
    },
  });

  return branchName;
};
