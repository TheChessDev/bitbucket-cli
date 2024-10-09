import path from "path";
import os from "os";

export const BASE_URL = "https://api.bitbucket.org/2.0";
export const BITBUCKET_REPOSITORIES_PATH = "/repositories/allpointpos-admin";

export const token = process.env.BITBUCKET_ACCESS_TOKEN;

export const CLONE_PATH = path.resolve(
  os.homedir(),
  process.env.CLONE_PATH || "./workspace",
);
