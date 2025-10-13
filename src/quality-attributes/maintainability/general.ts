import * as fs from "fs";
import { Score } from "../../types";
import { MaintainabilityInterface } from "./interface";
import { MethodNameCohesion } from "../../metrics/cohesion/method-name-cohesion";
import { McCabeCyclomaticComplexity } from "../../metrics/cyclomatic-complexity/mc-cabe-cyclomatic-complexity";
import { FunctionLength } from "../../metrics/size/function-length";
import { Fuzzy, mapFuzzyToWording } from "../../global/fuzzy-metric";
import { ProjectStructureReport } from "../../helper/analyze-project-structure";
import { PropagationCost } from "../../metrics/propagation-cost/propagation-cost";
import { AfferentCoupling } from "../../metrics/coupling/afferent-coupling";

class Maintainability implements MaintainabilityInterface {
  weight: number;
  overallScore: number = 0;
  score: {
    analyzability: Score;
    modifiability: Score;
    testability: Score;
    modularity: Score;
    reusability: Score;
  }
  projectStructure?: ProjectStructureReport;
  allIssues: {
    filePath: string;
    moduleName: string;
    moduleScore: number;
    fuzzyScore: Fuzzy;
    details: {
      description?: string;
    };
  }[] = [];

  constructor(weight = 1) {
    this.weight = weight;

    // Initialisiere die Score-Werte mit Default-Werten
    this.score = {
      analyzability: { weight: 1, fuzzy: Fuzzy.HORRIBLE },
      modifiability: { weight: 1, fuzzy: Fuzzy.HORRIBLE },
      testability: { weight: 1, fuzzy: Fuzzy.HORRIBLE },
      modularity: { weight: 1, fuzzy: Fuzzy.HORRIBLE },
      reusability: { weight: 1, fuzzy: Fuzzy.HORRIBLE },
    }
  }

  analyze(projectStructure: ProjectStructureReport): void {
    this.projectStructure = projectStructure;

    this.calculateModularity();
    this.calculateAnalyzability();
    this.calculateModifiability();
    this.calculateReusability();
    this.calculateTestability();

    this.calculateOverallScore();
  }

  calculateOverallScore(): void {
    const keys = Object.keys(this.score);
    const values = Object.values(this.score);
    this.overallScore = values.reduce((currentNumber, score) => currentNumber + (score.fuzzy * score.weight), 0) / keys.length;
  }
  calculateAnalyzability(): void {
    const cyclomaticComplexity = new McCabeCyclomaticComplexity();
    cyclomaticComplexity.calculate(this.projectStructure);

    const functionLength = new FunctionLength();
    functionLength.calculate(this.projectStructure);

    this.score.analyzability.fuzzy = (cyclomaticComplexity.fuzzyScore + functionLength.fuzzyScore) / 2;

    const content = [
      `[zurück](../REPORT.md)`,
      `# Analysierbarkeit`,
      `Score: ${this.score.analyzability.fuzzy} (=${mapFuzzyToWording(this.score.analyzability.fuzzy)})`,
      `| Metrik | Score | Fuzzy Score |`,
      `| -------- | -------- | -------- |`,
      `| [Zyklomatische Komplexität](#zyklomatische-komplexität) | ${cyclomaticComplexity.score.toFixed(2)} | ${cyclomaticComplexity.fuzzyScore} (=${mapFuzzyToWording(cyclomaticComplexity.fuzzyScore)}) |`,
      `| [Funktionslänge](#funktionslänge) | ${functionLength.score.toFixed(2)} | ${functionLength.fuzzyScore} (=${mapFuzzyToWording(functionLength.fuzzyScore)}) |`,
      `-----`,
      `## Zyklomatische Komplexität`,
      cyclomaticComplexity.interpreteResults(),
      `-----`,
      `## Funktionslänge`,
      functionLength.interpreteResults()
    ].join('\n');
    fs.writeFileSync('result/detailed/analyzability.md', content, 'utf-8');

    fs.writeFileSync('result/detailed/modules/analyzability.md', '## Cyclomatic Complexity\n' + cyclomaticComplexity.detailed.sort((a, b) => b.fuzzyScore - a.fuzzyScore).map((detail) => `Score: ${detail.moduleScore} (=${detail.fuzzyScore}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');
    fs.appendFileSync('result/detailed/modules/analyzability.md', '## Function Length\n' + functionLength.detailed.sort((a, b) => b.fuzzyScore - a.fuzzyScore).map((detail) => `Score: ${detail.moduleScore} (=${detail.fuzzyScore}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');

    this.allIssues.push(...cyclomaticComplexity.issues);
    this.allIssues.push(...functionLength.issues);
  }

  calculateModifiability(): void {
    const propagationCost = new PropagationCost();
    propagationCost.calculate(this.projectStructure);

    this.score.modifiability.fuzzy = propagationCost.fuzzyScore;

    const content = [
      `[zurück](../REPORT.md)`,
      `# Modifizierbarkeit`,
      `Score: ${this.score.modifiability.fuzzy} (=${mapFuzzyToWording(this.score.modifiability.fuzzy)})`,
      `| Metrik | Score | Fuzzy Score |`,
      `| -------- | -------- | -------- |`,
      `| [Propagation Cost](#propagation-cost) | ${propagationCost.score.toFixed(2)} | ${propagationCost.fuzzyScore} (=${mapFuzzyToWording(propagationCost.fuzzyScore)}) |`,
      `-----`,
      `## Propagation Cost`,
      propagationCost.interpreteResults(),
    ].join('\n');

    fs.writeFileSync('result/detailed/modifiability.md', content, 'utf-8');
    fs.writeFileSync('result/detailed/modules/modifiability.md', propagationCost.detailed.sort((a, b) => b.fuzzyScore - a.fuzzyScore).map((detail) => `Score: ${detail.moduleScore} (=${detail.fuzzyScore}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');

    this.allIssues.push(...propagationCost.issues);
  }

  calculateTestability(): void {
    const cyclomaticComplexity = new McCabeCyclomaticComplexity();
    cyclomaticComplexity.calculate(this.projectStructure);

    this.score.testability.fuzzy = cyclomaticComplexity.fuzzyScore;

    const content = [
      `[zurück](../REPORT.md)`,
      `# Testbarkeit`,
      `Score: ${this.score.testability.fuzzy} (=${mapFuzzyToWording(this.score.testability.fuzzy)})`,
      `| Metrik | Score | Fuzzy Score |`,
      `| -------- | -------- | -------- |`,
      `| [Zyklomatische Komplexität](#zyklomatische-komplexität) | ${cyclomaticComplexity.score.toFixed(2)} | ${cyclomaticComplexity.fuzzyScore} (=${mapFuzzyToWording(cyclomaticComplexity.fuzzyScore)}) |`,
      `-----`,
      `## Zyklomatische Komplexität`,
      cyclomaticComplexity.interpreteResults(),
    ].join('\n');

    fs.writeFileSync('result/detailed/testability.md', content, 'utf-8');
    fs.writeFileSync('result/detailed/modules/testability.md', cyclomaticComplexity.detailed.sort((a, b) => b.fuzzyScore - a.fuzzyScore).map((detail) => `Score: ${detail.moduleScore} (=${detail.fuzzyScore}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');

    this.allIssues.push(...cyclomaticComplexity.issues);
  }

  calculateModularity(): void {
    const cohesion = new MethodNameCohesion();
    cohesion.calculate(this.projectStructure);

    const coupling = new AfferentCoupling();
    coupling.calculate(this.projectStructure);

    this.score.modularity.fuzzy = (cohesion.fuzzyScore + coupling.fuzzyScore) / 2;

    const content = [
      `[zurück](../REPORT.md)`,
      `# Modularität`,
      `Score: ${this.score.modularity.fuzzy} (=${mapFuzzyToWording(this.score.modularity.fuzzy)})`,
      `| Metrik | Score | Fuzzy Score |`,
      `| -------- | -------- | -------- |`,
      `| [Methodennamen Kohäsion](#methodennamen-kohäsion) | ${cohesion.score.toFixed(2)} | ${cohesion.fuzzyScore} (=${mapFuzzyToWording(cohesion.fuzzyScore)}) |`,
      `| [Afferente Kopplung](#afferente-kopplung) | ${coupling.score.toFixed(2)} | ${coupling.fuzzyScore} (=${mapFuzzyToWording(coupling.fuzzyScore)}) |`,
      `-----`,
      `## Methodennamen Kohäsion`,
      cohesion.interpreteResults(),
      `-----`,
      `## Afferente Kopplung`,
      coupling.interpreteResults()
    ].join('\n');

    fs.writeFileSync('result/detailed/modularity.md', content, 'utf-8');
    fs.writeFileSync('result/detailed/modules/modularity.md', '## Cohesion\n' + cohesion.detailed.sort((a, b) => b.fuzzyScore - a.fuzzyScore).map((detail) => `Score: ${detail.moduleScore} (=${detail.fuzzyScore}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');
    fs.appendFileSync('result/detailed/modules/modularity.md', '## Coupling\n' + coupling.detailed.sort((a, b) => b.fuzzyScore - a.fuzzyScore).map((detail) => `Score: ${detail.moduleScore} (=${detail.fuzzyScore}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');

    this.allIssues.push(...cohesion.issues);
    this.allIssues.push(...coupling.issues);
  }

  calculateReusability(): void {
    const cyclomaticComplexity = new McCabeCyclomaticComplexity();
    cyclomaticComplexity.calculate(this.projectStructure);

    const methodNameCohesion = new MethodNameCohesion();
    methodNameCohesion.calculate(this.projectStructure);

    const coupling = new AfferentCoupling();
    coupling.calculate(this.projectStructure);

    this.score.reusability.fuzzy = (cyclomaticComplexity.fuzzyScore + methodNameCohesion.fuzzyScore + coupling.fuzzyScore) / 3;
    const content = [
      `[zurück](../REPORT.md)`,
      `# Wiederverwendbarkeit`,
      `Score: ${this.score.reusability.fuzzy} (=${mapFuzzyToWording(this.score.reusability.fuzzy)})`,
      `| Metrik | Score | Fuzzy Score |`,
      `| -------- | -------- | -------- |`,
      `| [Zyklomatische Komplexität](#zyklomatische-komplexität) | ${cyclomaticComplexity.score.toFixed(2)} | ${cyclomaticComplexity.fuzzyScore} (=${mapFuzzyToWording(cyclomaticComplexity.fuzzyScore)}) |`,
      `| [Methodennamen Kohäsion](#methodennamen-kohäsion) | ${methodNameCohesion.score.toFixed(2)} | ${methodNameCohesion.fuzzyScore} (=${mapFuzzyToWording(methodNameCohesion.fuzzyScore)}) |`,
      `| [Afferente Kopplung](#afferente-kopplung) | ${coupling.score.toFixed(2)} | ${coupling.fuzzyScore} (=${mapFuzzyToWording(coupling.fuzzyScore)}) |`,
      `-----`,
      `## Zyklomatische Komplexität`,
      cyclomaticComplexity.interpreteResults(),
      `-----`,
      `## Methodennamen Kohäsion`,
      methodNameCohesion.interpreteResults(),
      `-----`,
      `## Afferente Kopplung`,
      coupling.interpreteResults()
    ].join('\n');

    fs.writeFileSync('result/detailed/reusability.md', content, 'utf-8');

    fs.writeFileSync('result/detailed/modules/reusability.md', '## Cyclomatic Complexity\n' + cyclomaticComplexity.detailed.sort((a, b) => b.fuzzyScore - a.fuzzyScore).map((detail) => `Score: ${detail.moduleScore} (=${detail.fuzzyScore}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');
    fs.appendFileSync('result/detailed/modules/reusability.md', '## Methodname Cohesion\n' + methodNameCohesion.detailed.sort((a, b) => b.fuzzyScore - a.fuzzyScore).map((detail) => `Score: ${detail.moduleScore} (=${detail.fuzzyScore}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');
    fs.appendFileSync('result/detailed/modules/reusability.md', '## Afferent Coupling\n' + coupling.detailed.sort((a, b) => b.fuzzyScore - a.fuzzyScore).map((detail) => `Score: ${detail.moduleScore} (=${detail.fuzzyScore}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');

    this.allIssues.push(...cyclomaticComplexity.issues);
    this.allIssues.push(...methodNameCohesion.issues);
    this.allIssues.push(...coupling.issues);
  }

  reduceIssues(): Record<string, { moduleName: string; moduleScore: number; fuzzyScore: Fuzzy; issues: string[] }> {
    return this.allIssues.reduce((acc, issue) => {
    const { filePath, moduleName, moduleScore, fuzzyScore, details } = issue;

    if (!acc[filePath]) {
      acc[filePath] = {
        moduleName,
        moduleScore,
        fuzzyScore,
        issues: [],
      };
    }

    if (details.description) {
      if (!acc[filePath].issues.includes(details.description)) {
        acc[filePath].issues.push(details.description);
      }
    }

    return acc;
  }, {});
  }

  interpreteResults(): string {
    return [
      `## Wartbarkeit`,
      `| Sub-Charakteristik | Score | Details |`,
      `| -------- | -------- | -------- |`,
      `| Analysierbarkeit | ${this.score.analyzability.fuzzy} (=${mapFuzzyToWording(this.score.analyzability.fuzzy)}) | [Bericht](detailed/analyzability.md) |`,
      `| Modularität | ${this.score.modularity.fuzzy} (=${mapFuzzyToWording(this.score.modularity.fuzzy)}) | [Bericht](detailed/modularity.md) |`,
      `| Wiederverwendbarkeit | ${this.score.reusability.fuzzy} (=${mapFuzzyToWording(this.score.reusability.fuzzy)}) | [Bericht](detailed/reusability.md) |`,
      `| Modifizierbarkeit | ${this.score.modifiability.fuzzy} (=${mapFuzzyToWording(this.score.modifiability.fuzzy)}) | [Bericht](detailed/modifiability.md) |`,
      `| Testbarkeit | ${this.score.testability.fuzzy} (=${mapFuzzyToWording(this.score.testability.fuzzy)}) | [Bericht](detailed/testability.md) |`,
      `## Problemmodule`,
      `| Modul | Probleme |`,
      `| -------- | -------- |`,
      `${Object.entries(this.reduceIssues()).sort((a, b) => b[1].issues.length - a[1].issues.length).map(([filePath, info]) => `| ${filePath} | ${info.issues.map((issue, index) => `${info.issues.length > 1 ? `${index + 1}. ` : ''}${issue}`).join('<br>')} |`).join('\n')}`,
    ].join('\n')
  }


}

export {
  Maintainability
}
