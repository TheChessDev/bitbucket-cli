// Clone path from .env file and resolve to absolute path
const CLONE_PATH = path.resolve(
  os.homedir(),
  process.env.CLONE_PATH || "./workspace",
);
