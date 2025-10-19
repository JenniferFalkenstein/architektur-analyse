import * as fs from "fs";
import { Score } from "../../types";
import { MaintainabilityInterface } from "./maintainability-interface";
import { MethodNameCohesion } from "../../metrics/cohesion/method-name-cohesion";
import { McCabeCyclomaticComplexity } from "../../metrics/cyclomatic-complexity/mc-cabe-cyclomatic-complexity";
import { FunctionLength } from "../../metrics/size/function-length";
import { Grade, mapGradeToWording } from "../../global/grade-scale";
import { ProjectStructureReport } from "../../helper/analyze-project-structure";
import { PropagationCost } from "../../metrics/propagation-cost/propagation-cost";
import { EfferentCoupling } from "../../metrics/coupling/efferent-coupling";

class Maintainability implements MaintainabilityInterface {
  weight: number;
  overallGrade: number = 0;
  subAttributes: {
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
    grade: Grade;
    details: {
      description?: string;
    };
  }[] = [];

  constructor(weight = 1) {
    this.weight = weight;

    // Initialisiere die Score-Werte mit Default-Werten
    this.subAttributes = {
      analyzability: { weight: 1, grade: Grade.HORRIBLE },
      modifiability: { weight: 1, grade: Grade.HORRIBLE },
      testability: { weight: 1, grade: Grade.HORRIBLE },
      modularity: { weight: 1, grade: Grade.HORRIBLE },
      reusability: { weight: 1, grade: Grade.HORRIBLE },
    }
  }

  analyze(projectStructure: ProjectStructureReport): void {
    this.projectStructure = projectStructure;

    this.calculateModularity();
    this.calculateAnalyzability();
    this.calculateModifiability();
    this.calculateReusability();
    this.calculateTestability();

    this.calculateOverallGrade();
  }

  calculateOverallGrade(): void {
    const keys = Object.keys(this.subAttributes);
    const values = Object.values(this.subAttributes);
    this.overallGrade = values.reduce((currentNumber, score) => currentNumber + (score.grade * score.weight), 0) / keys.length;
  }
  calculateAnalyzability(): void {
    const cyclomaticComplexity = new McCabeCyclomaticComplexity();
    cyclomaticComplexity.calculate(this.projectStructure);

    const functionLength = new FunctionLength();
    functionLength.calculate(this.projectStructure);

    this.subAttributes.analyzability.grade = (cyclomaticComplexity.grade + functionLength.grade) / 2;

    const content = [
      `[zurück](../REPORT.md)`,
      `# Analysierbarkeit`,
      `Score: ${this.subAttributes.analyzability.grade} (=${mapGradeToWording(this.subAttributes.analyzability.grade)})`,
      `| Metrik | Score | Bewertungsskala |`,
      `| -------- | -------- | -------- |`,
      `| [Komplexität](#komplexität) | ${cyclomaticComplexity.score.toFixed(2)} | ${cyclomaticComplexity.grade} (=${mapGradeToWording(cyclomaticComplexity.grade)}) |`,
      `| [Größe](#größe) | ${functionLength.score.toFixed(2)} | ${functionLength.grade} (=${mapGradeToWording(functionLength.grade)}) |`,
      `-----`,
      `## Komplexität`,
      cyclomaticComplexity.writeResult(),
      `-----`,
      `## Größe`,
      functionLength.writeResult()
    ].join('\n');
    fs.writeFileSync('result/detailed/analyzability.md', content, 'utf-8');

    fs.writeFileSync('result/detailed/modules/analyzability.md', '## Cyclomatic Complexity\n' + cyclomaticComplexity.detailed.sort((a, b) => b.grade - a.grade).map((detail) => `Score: ${detail.moduleScore} (=${detail.grade}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');
    fs.appendFileSync('result/detailed/modules/analyzability.md', '## Function Length\n' + functionLength.detailed.sort((a, b) => b.grade - a.grade).map((detail) => `Score: ${detail.moduleScore} (=${detail.grade}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');

    this.allIssues.push(...cyclomaticComplexity.issues);
    this.allIssues.push(...functionLength.issues);
  }

  calculateModifiability(): void {
    const propagationCost = new PropagationCost();
    propagationCost.calculate(this.projectStructure);

    this.subAttributes.modifiability.grade = propagationCost.grade;

    const content = [
      `[zurück](../REPORT.md)`,
      `# Modifizierbarkeit`,
      `Score: ${this.subAttributes.modifiability.grade} (=${mapGradeToWording(this.subAttributes.modifiability.grade)})`,
      `| Metrik | Score | Bewertungsskala |`,
      `| -------- | -------- | -------- |`,
      `| [Ausbreitung](#ausbreitung) | ${propagationCost.score.toFixed(2)} | ${propagationCost.grade} (=${mapGradeToWording(propagationCost.grade)}) |`,
      `-----`,
      `## Ausbreitung`,
      propagationCost.writeResult(),
    ].join('\n');

    fs.writeFileSync('result/detailed/modifiability.md', content, 'utf-8');
    fs.writeFileSync('result/detailed/modules/modifiability.md', propagationCost.detailed.sort((a, b) => b.grade - a.grade).map((detail) => `Score: ${detail.moduleScore} (=${detail.grade}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');

    this.allIssues.push(...propagationCost.issues);
  }

  calculateTestability(): void {
    const cyclomaticComplexity = new McCabeCyclomaticComplexity();
    cyclomaticComplexity.calculate(this.projectStructure);

    this.subAttributes.testability.grade = cyclomaticComplexity.grade;

    const content = [
      `[zurück](../REPORT.md)`,
      `# Testbarkeit`,
      `Score: ${this.subAttributes.testability.grade} (=${mapGradeToWording(this.subAttributes.testability.grade)})`,
      `| Metrik | Score | Bewertungsskala |`,
      `| -------- | -------- | -------- |`,
      `| [Komplexität](#komplexität) | ${cyclomaticComplexity.score.toFixed(2)} | ${cyclomaticComplexity.grade} (=${mapGradeToWording(cyclomaticComplexity.grade)}) |`,
      `-----`,
      `## Komplexität`,
      cyclomaticComplexity.writeResult(),
    ].join('\n');

    fs.writeFileSync('result/detailed/testability.md', content, 'utf-8');
    fs.writeFileSync('result/detailed/modules/testability.md', cyclomaticComplexity.detailed.sort((a, b) => b.grade - a.grade).map((detail) => `Score: ${detail.moduleScore} (=${detail.grade}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');

    this.allIssues.push(...cyclomaticComplexity.issues);
  }

  calculateModularity(): void {
    const cohesion = new MethodNameCohesion();
    cohesion.calculate(this.projectStructure);

    const coupling = new EfferentCoupling();
    coupling.calculate(this.projectStructure);

    this.subAttributes.modularity.grade = (cohesion.grade + coupling.grade) / 2;

    const content = [
      `[zurück](../REPORT.md)`,
      `# Modularität`,
      `Score: ${this.subAttributes.modularity.grade} (=${mapGradeToWording(this.subAttributes.modularity.grade)})`,
      `| Metrik | Score | Bewertungsskala |`,
      `| -------- | -------- | -------- |`,
      `| [Kohäsion](#kohäsion) | ${cohesion.score.toFixed(2)} | ${cohesion.grade} (=${mapGradeToWording(cohesion.grade)}) |`,
      `| [Kopplung](#kopplung) | ${coupling.score.toFixed(2)} | ${coupling.grade} (=${mapGradeToWording(coupling.grade)}) |`,
      `-----`,
      `## Kohäsion`,
      cohesion.writeResult(),
      `-----`,
      `## Kopplung`,
      coupling.writeResult()
    ].join('\n');

    fs.writeFileSync('result/detailed/modularity.md', content, 'utf-8');
    fs.writeFileSync('result/detailed/modules/modularity.md', '## Cohesion\n' + cohesion.detailed.sort((a, b) => b.grade - a.grade).map((detail) => `Score: ${detail.moduleScore} (=${detail.grade}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');
    fs.appendFileSync('result/detailed/modules/modularity.md', '## Coupling\n' + coupling.detailed.sort((a, b) => b.grade - a.grade).map((detail) => `Score: ${detail.moduleScore} (=${detail.grade}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');

    this.allIssues.push(...cohesion.issues);
    this.allIssues.push(...coupling.issues);
  }

  calculateReusability(): void {
    const cyclomaticComplexity = new McCabeCyclomaticComplexity();
    cyclomaticComplexity.calculate(this.projectStructure);

    const methodNameCohesion = new MethodNameCohesion();
    methodNameCohesion.calculate(this.projectStructure);

    const coupling = new EfferentCoupling();
    coupling.calculate(this.projectStructure);

    this.subAttributes.reusability.grade = (cyclomaticComplexity.grade + methodNameCohesion.grade + coupling.grade) / 3;
    const content = [
      `[zurück](../REPORT.md)`,
      `# Wiederverwendbarkeit`,
      `Score: ${this.subAttributes.reusability.grade} (=${mapGradeToWording(this.subAttributes.reusability.grade)})`,
      `| Metrik | Score | Bewertungsskala |`,
      `| -------- | -------- | -------- |`,
      `| [Komplexität](#komplexität) | ${cyclomaticComplexity.score.toFixed(2)} | ${cyclomaticComplexity.grade} (=${mapGradeToWording(cyclomaticComplexity.grade)}) |`,
      `| [Kohäsion](#kohäsion) | ${methodNameCohesion.score.toFixed(2)} | ${methodNameCohesion.grade} (=${mapGradeToWording(methodNameCohesion.grade)}) |`,
      `| [Kopplung](#kopplung) | ${coupling.score.toFixed(2)} | ${coupling.grade} (=${mapGradeToWording(coupling.grade)}) |`,
      `-----`,
      `## Komplexität`,
      cyclomaticComplexity.writeResult(),
      `-----`,
      `## Kohäsion`,
      methodNameCohesion.writeResult(),
      `-----`,
      `## Kopplung`,
      coupling.writeResult()
    ].join('\n');

    fs.writeFileSync('result/detailed/reusability.md', content, 'utf-8');

    fs.writeFileSync('result/detailed/modules/reusability.md', '## Cyclomatic Complexity\n' + cyclomaticComplexity.detailed.sort((a, b) => b.grade - a.grade).map((detail) => `Score: ${detail.moduleScore} (=${detail.grade}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');
    fs.appendFileSync('result/detailed/modules/reusability.md', '## Methodname Cohesion\n' + methodNameCohesion.detailed.sort((a, b) => b.grade - a.grade).map((detail) => `Score: ${detail.moduleScore} (=${detail.grade}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');
    fs.appendFileSync('result/detailed/modules/reusability.md', '## Efferent Coupling\n' + coupling.detailed.sort((a, b) => b.grade - a.grade).map((detail) => `Score: ${detail.moduleScore} (=${detail.grade}) [${detail.filePath}] ${detail.details || ''}\n`).join('\n'), 'utf-8');

    this.allIssues.push(...cyclomaticComplexity.issues);
    this.allIssues.push(...methodNameCohesion.issues);
    this.allIssues.push(...coupling.issues);
  }

  reduceIssues(): Record<string, { moduleName: string; moduleScore: number; grade: Grade; issues: string[] }> {
    return this.allIssues.reduce((acc, issue) => {
    const { filePath, moduleName, moduleScore, grade, details } = issue;

    if (!acc[filePath]) {
      acc[filePath] = {
        moduleName,
        moduleScore,
        grade,
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

  writeResults(): string {
    return [
      `## Wartbarkeit`,
      `| Sub-Charakteristik | Score | Details |`,
      `| -------- | -------- | -------- |`,
      `| Analysierbarkeit | ${this.subAttributes.analyzability.grade} (=${mapGradeToWording(this.subAttributes.analyzability.grade)}) | [Bericht](detailed/analyzability.md) |`,
      `| Modularität | ${this.subAttributes.modularity.grade} (=${mapGradeToWording(this.subAttributes.modularity.grade)}) | [Bericht](detailed/modularity.md) |`,
      `| Wiederverwendbarkeit | ${this.subAttributes.reusability.grade} (=${mapGradeToWording(this.subAttributes.reusability.grade)}) | [Bericht](detailed/reusability.md) |`,
      `| Modifizierbarkeit | ${this.subAttributes.modifiability.grade} (=${mapGradeToWording(this.subAttributes.modifiability.grade)}) | [Bericht](detailed/modifiability.md) |`,
      `| Testbarkeit | ${this.subAttributes.testability.grade} (=${mapGradeToWording(this.subAttributes.testability.grade)}) | [Bericht](detailed/testability.md) |`,
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
