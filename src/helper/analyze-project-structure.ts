import * as fs from 'fs';
import * as path from 'path';
import { Project } from "ts-morph";
import { PROJECT_STRUCTURE_JSON_PATH } from "../global/global-variables";

type ProjectStructure = {
  [packagePath: string]: {
    name: string,
    modules: {
      [modulePath: string]: string // moduleName
    }
  }
}

type ProjectStructureReport = {
  structure: ProjectStructure,
  flatModuleMap: string[]
}

const structure: ProjectStructure = {}

// async function hasDir(dirPath: string, pathNames: string[]): Promise<boolean> {
//   for (const name of pathNames) {
//     const fullPath = path.join(dirPath, name);
//     const stats = fs.statSync(fullPath);
//     if (stats.isDirectory()) return true;
//   }
//   return false;
// }

async function checkIsModule(filePath: string): Promise<boolean> {
  const project = new Project();
  project.addSourceFileAtPath(filePath);
  const functions = project.getSourceFiles()[0].getFunctions();
  if (functions.length < 1) {
    return false;
  }
  return true;
}

async function addModule(packagePath: string, modulePath: string, isIndex = false): Promise<void> {
  const packageName = path.basename(packagePath)
  const moduleName = path.basename(modulePath).replace('.ts', '');
  if (structure[packagePath]) {
    structure[packagePath].modules[isIndex ? `${modulePath}/index.ts` : modulePath] = moduleName;
  } else {
    structure[packagePath] = {
      name: packageName,
      modules: { [isIndex ? `${modulePath}/index.ts` : modulePath]: moduleName }
    }
  }
}

async function analyzeDir(dirPath: string, packagePath?: string, previousPackagePath?: string) {
  const items = fs.readdirSync(dirPath);

  if (items.includes('index.ts') && packagePath && previousPackagePath) {
    const isModule = await checkIsModule(path.join(dirPath, 'index.ts'))
    if (isModule) {
      await addModule(previousPackagePath, packagePath, true);
    }
  }

  for (const itemName of items) {
    if (itemName === 'index.ts' || itemName === 'node_modules') continue;

    const fullPath = path.join(dirPath, itemName);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      await analyzeDir(fullPath, path.join(dirPath, itemName), packagePath);

    } else if (stats.isFile() && itemName.includes('.ts')) {
      const isModule = await checkIsModule(fullPath);

      if (isModule && packagePath) {
        await addModule(packagePath, fullPath);
      }
    }
  }
}

// function countModules(structure: ProjectStructure): number {
//   const totalModules = Object.values(structure).reduce((currentValue, pkg) => currentValue + Object.keys(pkg.modules).length, 0);
//   return totalModules;
// }

function createFlatModuleArray(structure: ProjectStructure): string[] {
  const modules = [];
  Object.values(structure).forEach((pkg) => {
    const modulesInPkg = Object.keys(pkg.modules);
    modulesInPkg.forEach((module) => modules.push(module))
  })
  return modules;
}

async function analyzeProjectStructure (filePath: string): Promise<ProjectStructureReport> {
  await analyzeDir(filePath);

  const flatModuleMap = createFlatModuleArray(structure);
  fs.writeFileSync(PROJECT_STRUCTURE_JSON_PATH, JSON.stringify({ flatModuleMap, structure}), 'utf-8');
  return { flatModuleMap, structure };
}

export {
  analyzeProjectStructure,
  ProjectStructure,
  ProjectStructureReport,
}
