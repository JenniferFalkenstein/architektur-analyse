import { DEPENDENCY_TREE_PATH } from "./global/global-variables";
import { getConfig } from "./get-config";
import { runNpmScript } from "./helper/run-npm-script";
import { Maintainability } from "./quality-attributes/maintainability/general";
import { QualityAnalyzer } from "./quality-attributes/quality-analyzer";
import { analyzeProjectStructure } from "./helper/analyze-project-structure";
import logger from "./helper/logger";

async function analyzeProject(filePath: string): Promise<void> {
  logger.info(`Analyzing project at: ${filePath}`);
  // TODO: vielleicht mit in den Befehl noch die tsconfig mitgeben
  // const configFile = getConfig();
  // await runNpmScript(`depcruise --output-type json ${filePath} > ${DEPENDENCY_TREE_PATH}`);

  const projectStructure = await analyzeProjectStructure(filePath);

  if (projectStructure.flatModuleMap.length === 0) {
    logger.error(`Project has no modules!`);
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
