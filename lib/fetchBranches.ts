import { token } from "./constants";
import { logger } from "../logger";
import { getUrl } from "../util";
import { readFromCache, writeToCache } from "../cache";

export const fetchBranches = async (repoSlug: string) => {
  const CACHE_TTL = 10 * 60 * 1000; // 10 mins.

  const cachedBranches = await readFromCache(`branches_${repoSlug}`, CACHE_TTL);
  if (cachedBranches) return cachedBranches;

  const branches = [];
  let nextUrl = getUrl(
    `/repositories/allpointpos-admin/${repoSlug}/refs/branches?pagelen=10`,
  );

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

        const branchList = result.values.map((branch: any) => ({
          name: branch.name,
        }));

        branches.push(...branchList);

        // Handle pagination
        nextUrl = result.next || null;
      } else {
        logger.error(`Failed to fetch branches: ${response.statusText}`);
        break;
      }
    }
    await writeToCache(`branches_${repoSlug}`, branches);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching branches: ${error.message}`);
    }
  }

  return branches;
};
