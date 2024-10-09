import { BASE_URL } from "./lib/constants";

export function getUrl(path: string): string {
  return `${BASE_URL}${path}`;
}
