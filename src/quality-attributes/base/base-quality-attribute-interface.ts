import { Project } from "ts-morph";
import { Score } from "../../types";
import { ProjectStructureReport } from "../../helper/analyze-project-structure";
import { Grade } from "../../global/grade-scale";

interface BaseQualityAttributeInterface {
  weight: number;
  overallGrade: Grade;
  subAttributes: { [metric: string]: Score }
  projectStructure?: ProjectStructureReport;

  calculateOverallGrade(): void;
  analyze(projectStructure: ProjectStructureReport): void;
  writeResults(): string;
}

export {
  BaseQualityAttributeInterface
}
