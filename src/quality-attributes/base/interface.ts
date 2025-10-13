import { Project } from "ts-morph";
import { Score } from "../../types";
import { ProjectStructureReport } from "../../helper/analyze-project-structure";

interface BaseQualityAttributeInterface {
  weight: number;
  overallScore: number;
  score: { [metric: string]: Score }
  projectStructure?: ProjectStructureReport;

  calculateOverallScore(): void;
  analyze(projectStructure: ProjectStructureReport): void;
}

export {
  BaseQualityAttributeInterface
}
