import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { logger } from "../logger";

const CACHE_FILE_PATH = path.resolve(__dirname, "cache.json");

export const readFromCache = async (key: string, ttl: number) => {
  if (!existsSync(CACHE_FILE_PATH)) {
    return null;
  }

  try {
    const cache = JSON.parse(await fs.readFile(CACHE_FILE_PATH, "utf-8"));

    const now = Date.now();
    if (cache[key] && now - cache[key].lastFetched < ttl) {
      logger.info(`Returning cached ${key} data`);
      return cache[key].data;
    }
  } catch (error) {
    logger.error(`Error reading cache for ${key}:`, error);
  }

  return null;
};

export const writeToCache = async (key: string, data: any) => {
  let cache: Record<string, any> = {};

  if (existsSync(CACHE_FILE_PATH)) {
    try {
      cache = JSON.parse(await fs.readFile(CACHE_FILE_PATH, "utf-8"));
    } catch (error) {
      logger.error(
        `Error reading cache file before writing for ${key}:`,
        error,
      );
    }
  }

  cache[key] = {
    data,
    lastFetched: Date.now(),
  };

  try {
    await fs.writeFile(
      CACHE_FILE_PATH,
      JSON.stringify(cache, null, 2),
      "utf-8",
    );
    logger.info(`Cached ${key} data successfully`);
  } catch (error) {
    logger.error(`Error writing to cache for ${key}:`, error);
  }
};
