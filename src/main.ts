import { selectPath } from "./helper/file-selector";
import { analyzeProject } from "./analyze-project";
import * as fs from 'fs';

async function main() {
  const selectedPath = await selectPath();
  if (!selectedPath) return;

  if (!fs.existsSync('result')) {
    fs.mkdirSync('result')
  }
  if (!fs.existsSync('result/detailed')) {
    fs.mkdirSync('result/detailed')
  }
  if (!fs.existsSync('result/detailed/modules')) {
    fs.mkdirSync('result/detailed/modules')
  }
  await analyzeProject(selectedPath);
}

main();
