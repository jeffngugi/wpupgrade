import path, { dirname } from "path";
import { fileURLToPath } from "url";

export default async function executeTask([task, ...args]) {
  const module = path.join(
    dirname(fileURLToPath(import.meta.url)),
    "tasks",
    `${task}.mjs`,
  );

  try {
    const cmd = (await import(module)).default;

    cmd(args);
  } catch (e) {
    console.warn(e.message);
  }
}
