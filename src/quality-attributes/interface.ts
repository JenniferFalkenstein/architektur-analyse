
import { ProjectStructureReport } from "../helper/analyze-project-structure";
import { MaintainabilityInterface } from "./maintainability/interface";

  interface QualityAnalyzerInterface {
    qualityAttributes: {
      maintainability: MaintainabilityInterface;
      // Leicht erweiterbar durch weitere Qualitätsmerkmale, siehe folgende Codezeile:
      // reliability: Reliability;
    }

  calculateOverallScore(): number;

  analyze(projectStructure: ProjectStructureReport): void;
}

export {
  QualityAnalyzerInterface,
}
