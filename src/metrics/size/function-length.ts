import { FunctionDeclaration, Project, SyntaxKind } from "ts-morph";
import { Algorithm } from "../algorithm-interface";
import logger from "../../helper/logger";
import { Grade, mapGradeToWording } from "../../global/grade-scale";
import { ProjectStructureReport } from "../../helper/analyze-project-structure";
import { addAllFilesToProject } from "../../helper/ts-morph-project-helper";

class FunctionLength implements Algorithm {
  grade: Grade;
  name = "Funktionslänge";
  description = "Misst die Größe eines Moduls basierend auf ihrer Anzahl von Zeilen an Code (LOC = Lines of Code). Eine exzessive Länge deutet oft auf eine Verletzung des Single Responsibility Principle (SRP), erschwerte Wartung, geringere Verständlichkeit und potenziell hohe Komplexität hin.";
  score: number;
  detailed: { filePath: string; moduleName: string; moduleScore: number; grade?: number; details?: string; }[] = [];
  issues: {
    filePath: string;
    moduleName: string;
    moduleScore: number;
    grade: Grade;
    details: {
      description?: string;
    };
  }[] = [];

  addToIssue(moduleName: string, filePath: string, moduleScore: number, grade: number, description?: string) {
    this.issues.push({ moduleName, filePath, moduleScore, grade, details: { description } });
  }

  calculate(projectStructure: ProjectStructureReport): void {
    logger.debug(`--------------------\nFUNCTION LENGTH:`)
    const project = new Project();
    addAllFilesToProject(project, projectStructure.structure);

    const sourceFiles = project.getSourceFiles();
    const moduleScores: number[] = [];
    for (const sourceFile of sourceFiles) {

      const functions = sourceFile.getFunctions();
      if (functions.length < 1) {
        logger.warn(`Die Datei ${sourceFile.getFilePath()} besitzt keine Funktionen zum Berechnen. Wird bei der Funktionsgrößen-Berechnung wird ignoriert...`);
        continue;
      }

      const functionScoresForModule: number[] = []
      const moduleIssues: string[] = [];

      // Berechne die Zyklomatische Komplexität jeder Funktion im Modul
      functions.forEach(func => {
        const functionScore = this.calculateLLOC(func);
        const functionGrade = this.interpreteScore(functionScore);
        functionScoresForModule.push(functionScore);

        if (functionGrade === Grade.HORRIBLE || functionGrade === Grade.NOT_GOOD) {
          moduleIssues.push(`Funktion \`${func.getName()}\` in dem Modul hat eine Größe von ${functionScore} Zeilen`);
        }
      });

      // Berechne die Zyklomatische Komplexität für das jeweilige Modul
      const moduleScore = this.calculateMean(functionScoresForModule);
      const moduleGrade = this.interpreteScore(moduleScore);

      this.detailed.push({
        filePath: sourceFile.getFilePath(),
        moduleName: sourceFile.getBaseName(),
        moduleScore: moduleScore,
        grade: moduleGrade,
      })
      logger.debug(`${sourceFile.getFilePath()} has score of ${moduleScore} and Grade of (=${mapGradeToWording(moduleGrade)})`);

      if (moduleIssues.length > 0) {
        const moduleName = sourceFile.getBaseName();
        const filePath = sourceFile.getFilePath();
        this.addToIssue(moduleName, filePath, moduleScore, moduleGrade, `${moduleIssues.join('')}`);
      }
      moduleScores.push(moduleScore);
    }

    const overAllScore = this.calculateMean(moduleScores);
    const overAllGrade = this.interpreteScore(overAllScore);
    this.grade = overAllGrade;
    this.score = overAllScore;
  }

  writeResult(): string {
    return [
`**${this.name}**`,
' ',
`*Beschreibung: ${this.description}*`,
' ',
`Gesamt-Größe: ${mapGradeToWording(this.grade)}`,
' ',
`**Interpretation der Werte:**`,
`| Score | Bewertung |`,
`| -------- | -------- |`,
`| 0 - 15 | Hervorragend (=1) |`,
`| 16 - 25 | Gut (=2) |`,
`| 26 - 40 | Okay (=3) |`,
`| 41 - 60 | Nicht Okay (=4) |`,
`| > 60 | Grauenvoll (=5) |`,
' ',
`**Details zu Problem-Modulen:**`,
`| Modul | Score | Beschreibung |`,
`| -------- | -------- | -------- |`,
this.issues.length === 0 && 'keine Problem-Module gefunden',
this.issues.sort((a, b) => b.grade - a.grade).map(issue => {
  return `| ${issue.filePath} | ${issue.moduleScore.toFixed(2)} (Bewertungsskala: ${issue.grade} = ${mapGradeToWording(issue.grade)}) | ${issue.details.description} |`
}).join('\n'),
'-----',
`**Verbesserungsvorschläge:**`,
`- **Refactoring durch Extraktion:** Identifiziere logisch abgrenzbare Blöcke innerhalb der Funktion und lagere diese als private, gut benannte Hilfsfunktionen (Helper Methods) aus`,
`- **Wende das Single Responsibility Principle (SRP) an:** Überprüfe, ob die Funktion mehrere unabhängige Schritte durchführt (z.B. Validierung, Berechnung, Speicherung). Teile die Funktion entlang dieser Verantwortlichkeiten auf`,
`- **Reduziere die Komplexität:** Oft geht eine hohe Funktionslänge mit einer hohen Zyklomatischen Komplexität einher. Konzentriere dich darauf, Verzweigungen und Schachtelungen zu reduzieren, was die Länge automatisch verringert`,
].join('\n')
  }

  calculateLLOC(func: FunctionDeclaration) {
    let code = func.getBody().getText();

    // Entferne Kommentare oder Kommentar-Blöcke mit Regex
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    code = code.replace(/\/\/.*$/gm, '');

    // Filter außerdem leere Zeilen heraus
    return code.split('\n').filter(line => line.trim().length > 0).length;
  }

  calculateMean(scores: number[]): number {
    if (scores.length === 0) {
      logger.warn('Keine Werte vorhanden, um einen Gesamtwert zu berechnen.');
      return;
    }
    const mean = scores.reduce((acc, val) => acc + val, 0) / scores.length;
    return mean;
  }

  interpreteScore(score: number): Grade {
    if (score >= 0 && score <= 15) {
      return Grade.EXCELLENT;
    } else if (score > 15 && score <= 25) {
      return Grade.GOOD;
    } else if (score > 25 && score <= 40) {
      return Grade.OKAY
    } else if (score > 40 && score < 60) {
      return Grade.NOT_GOOD;
    } else {
      return Grade.HORRIBLE;
    }
  }

}

export {
  FunctionLength,
}
