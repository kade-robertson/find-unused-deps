import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { ripGrep } from 'ripgrep-js';

const main = () => {
  if (process.argv.length < 3) {
    console.error('Error: No path to search provided.');
    return 1;
  }

  const projectPath = process.argv[2];
  if (!fs.existsSync(projectPath)) {
    console.error('Error: Project path does not exist.');
    return 2;
  }

  const packageFilePath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(packageFilePath)) {
    console.error('Error: Cannot find package.json in project path.');
    return 3;
  }

  const packageFile: Record<string, string> = JSON.parse(fs.readFileSync(packageFilePath, { encoding: 'utf-8' }));
  if (!Object.keys(packageFile).includes('dependencies')) {
    console.error('Error: The found package.json file has no dependencies.');
    return 4;
  }

  console.log('Searching for dependencies...');
  Object.keys(packageFile.dependencies).forEach(async (dependency) => {
    const results = await ripGrep(projectPath, {
      string: dependency,
      globs: ['!{node_modules,.git,package.json,yarn.lock,package-lock.json}'],
    });
    let resultColor = chalk.blueBright;
    if (results.length === 0) {
      resultColor = chalk.redBright;
    }
    if (results.length === 1) {
      resultColor = chalk.yellowBright;
    }
    console.log(
      `- ${chalk.greenBright(dependency)} was found in ${resultColor(results.length)} file${
        results.length !== 1 ? 's' : ''
      }.`
    );
  });
  return 0;
};

main();
