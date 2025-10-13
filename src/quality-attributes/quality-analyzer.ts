import { QualityAnalyzerInterface } from "./interface";
import { MaintainabilityInterface } from "./maintainability/interface";
import { mapFuzzyToWording } from "../global/fuzzy-metric";
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

    const overallScore = this.calculateOverallScore();
    const report = this.interpreteResults(overallScore)

    fs.writeFileSync('result/REPORT.md', report, 'utf-8');
  }

  calculateOverallScore(): number {
    const keys = Object.keys(this.qualityAttributes);
    const values = Object.values(this.qualityAttributes);

    return values.reduce((currentNumber, attribute) => currentNumber + (attribute.overallScore * attribute.weight), 0) / keys.length;;
  }

  interpreteResults(overallScore: number): string {
    return [
      `# Projekt-Bewertung`,
      `Ergebnis: ${overallScore} (=${mapFuzzyToWording(overallScore)})`,
      this.qualityAttributes.maintainability.interpreteResults(),
    ].join('\n')
  }
}

export {
  QualityAnalyzer
}
