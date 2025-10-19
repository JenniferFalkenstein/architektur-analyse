import { Maintainability } from "./quality-attributes/maintainability/maintainability";
import { QualityAnalyzer } from "./quality-attributes/quality-analyzer";
import { analyzeProjectStructure } from "./helper/analyze-project-structure";
import logger from "./helper/logger";

async function analyzeProject(filePath: string): Promise<void> {
  const projectStructure = await analyzeProjectStructure(filePath);

  if (projectStructure.flatModuleMap.length === 0) {
    logger.error(`Das Projekt hat keine Module!`);
    return;
  }

  const maintainability = new Maintainability();
  const analyzer = new QualityAnalyzer(maintainability);

  analyzer.analyze(projectStructure);

  // Beispiel-Erweiterung, wenn bekannt ist dass es sich um eine Layered Architecture handelt
  // if (configFile.layeredArchitecture !== undefined) {
  //   const layeredMaintainability = new LayeredMaintainability();
  //   const layeredAnalyzer = new QualityAnalyzer(layeredMaintainability);
  //   layeredAnalyzer.analyze(filePath);
  // }
}

export {
  analyzeProject
}
