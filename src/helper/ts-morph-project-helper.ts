import { Project } from "ts-morph";
import { ProjectStructure } from "./analyze-project-structure";

async function addAllFilesToProject(project: Project, projectStructure: ProjectStructure): Promise<Project> {
  for (const [_packagePath, packageData] of Object.entries(projectStructure)) {
    const modulePaths = Object.keys(packageData.modules);

    modulePaths.forEach((path) => project.addSourceFileAtPath(path))
  }
  return project;
}

// Wäre in Zukunft eine option, um gefilterte Module hinzuzufügen
async function addFilteredFilesToProject(project: Project, projectStructure: ProjectStructure, filterKeywords: string[]): Promise<Project> {
  for (const [_packagePath, packageData] of Object.entries(projectStructure)) {
    const modulePaths = Object.keys(packageData.modules);

    // Wenn der Package-Name nicht eins der Keywörter entspricht, füge es nicht zum Projekt hinzu
    if (!filterKeywords.includes(packageData.name)) continue;

    modulePaths.forEach((path) => project.addSourceFileAtPath(path))
  }
  return project;
}

export {
  addAllFilesToProject,
  addFilteredFilesToProject,
}
