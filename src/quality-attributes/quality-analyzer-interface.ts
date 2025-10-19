
import { Grade } from "../global/grade-scale";
import { ProjectStructureReport } from "../helper/analyze-project-structure";
import { MaintainabilityInterface } from "./maintainability/maintainability-interface";

  interface QualityAnalyzerInterface {
    qualityAttributes: {
      maintainability: MaintainabilityInterface;
      // Leicht erweiterbar durch weitere Qualitätsmerkmale, siehe folgende Codezeile:
      // reliability: ReliabilityInterface;
    }

  calculateOverallGrade(): number;

  analyze(projectStructure: ProjectStructureReport): void;
  writeResults(overallGrade: Grade): string;
}

export {
  QualityAnalyzerInterface,
}
