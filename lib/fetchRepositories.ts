import { BITBUCKET_REPOSITORIES_PATH, token } from "./constants";
import { logger } from "../logger";
import { getUrl } from "../util";
import { readFromCache, writeToCache } from "../cache";

export const fetchRepositories = async () => {
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day

  const cachedRepositories = await readFromCache("repositories", CACHE_TTL);

  if (cachedRepositories) return cachedRepositories;

  const repositories: { name: string; sshUrl: string }[] = [];
  let nextUrl = getUrl(`${BITBUCKET_REPOSITORIES_PATH}?pagelen=100`);

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
        nextUrl = result.next || null;
      } else {
        logger.error(`Failed to fetch repositories: ${response.statusText}`);
        break;
      }
    }

    await writeToCache("repositories", repositories);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching repositories: ${error.message}`);
    }
  }

  return repositories;
};
