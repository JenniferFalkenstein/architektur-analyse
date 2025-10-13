import { exec, execSync } from 'child_process';

async function runNpmScript(command: string) {
  execSync(command);
}

export  {
  runNpmScript
}
