import { QualityAnalyzerInterface } from "./quality-analyzer-interface";
import { MaintainabilityInterface } from "./maintainability/maintainability-interface";
import { Grade, mapGradeToWording } from "../global/grade-scale";
import { ProjectStructureReport } from "../helper/analyze-project-structure";
import * as fs from 'fs';

class QualityAnalyzer implements QualityAnalyzerInterface {
  qualityAttributes: {
    maintainability: MaintainabilityInterface;
    // Erweiterung:
    // performanceEfficiency: PerformanceEfficiencyInterface;
  };

  constructor(
    maintainability: MaintainabilityInterface,
    // Erweiterung:
    // performanceEfficiency: PerformanceEfficiencyInterface;
  ) {
    this.qualityAttributes = {
      maintainability: maintainability
      // Erweiterung:
      // performanceEfficiency: performanceEfficiency
    }
  }

  analyze(projectStructure: ProjectStructureReport): void {
    this.qualityAttributes.maintainability.analyze(projectStructure);
    // Erweiterung:
    // this.qualityAttributes.performanceEfficiency.analyze(projectStructure);

    const overallGrade = this.calculateOverallGrade();
    const report = this.writeResults(overallGrade)

    fs.writeFileSync('result/REPORT.md', report, 'utf-8');
  }

  calculateOverallGrade(): number {
    const keys = Object.keys(this.qualityAttributes);
    const values = Object.values(this.qualityAttributes);

    return values.reduce((currentNumber, attribute) => currentNumber + (attribute.overallGrade * attribute.weight), 0) / keys.length;;
  }

  writeResults(overallGrade: Grade): string {
    return [
      `# Projekt-Bewertung`,
      `Ergebnis: ${overallGrade} (=${mapGradeToWording(overallGrade)})`,
      this.qualityAttributes.maintainability.writeResults(),
    ].join('\n')
  }
}

export {
  QualityAnalyzer
}
