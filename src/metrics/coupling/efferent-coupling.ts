import { FunctionDeclaration, Project, SyntaxKind } from "ts-morph";
import { Algorithm } from "../algorithm-interface";
import logger from "../../helper/logger";
import { Grade, mapGradeToWording } from "../../global/grade-scale";
import { ProjectStructureReport } from "../../helper/analyze-project-structure";
import { addAllFilesToProject } from "../../helper/ts-morph-project-helper";

class EfferentCoupling implements Algorithm {
  grade: Grade;
  name = "Efferente Kopplung";
  description = "Misst die **funktionale Kopplung** eines Moduls basierend auf der **Anzahl der von ihm importierten lokalen Module und Services**. Eine hohe Anzahl von Imports (Efferent Coupling) deutet auf eine geringe Unabhängigkeit, erhöhte Wartungskosten und eine geringere Testbarkeit des Moduls hin.";
  score: number;
  detailed: { filePath: string; moduleName: string; moduleScore: number; grade?: number; details?: string; }[] = [];
  issues: { filePath: string; moduleName: string; moduleScore: number; grade: Grade; details: {   description?: string; }}[] = [];

  addToIssue(moduleName: string, filePath: string, moduleScore: number, grade: number, description?: string) {
    this.issues.push({ moduleName, filePath, moduleScore, grade, details: { description } });
  }

  calculate(projectStructure: ProjectStructureReport): void {
    logger.debug(`--------------------\nCOUPLING:`)
    const project = new Project();
    addAllFilesToProject(project, projectStructure.structure);

    const sourceFiles = project.getSourceFiles();
    const moduleScores: number[] = [];
    for (const sourceFile of sourceFiles) {
      let efferentCount = 0;
      const importDeclarations = sourceFile.getImportDeclarations();

      for (const importDeclaration of importDeclarations) {
        const importPath = importDeclaration.getModuleSpecifierValue();

        // Schließe nur relative Imports ein (also keine externen packages, wie z.B. node_modules, fs, etc.)
        if (importPath.startsWith('.') || importPath.startsWith('/')) {
          const sourceFilePath = importDeclaration.getSourceFile().getFilePath();

          if (projectStructure.flatModuleMap.includes(sourceFilePath)) {
            // Wenn das Modul bereits in im Zähl-Objekt vorhanden ist, addiere 1, sonst füge neu hinzu
            efferentCount += 1;
          }
        }
      }

      const grade = this.interpreteScore(efferentCount);
      if (grade === Grade.NOT_GOOD || grade === Grade.HORRIBLE) {
        this.addToIssue(sourceFile.getBaseName(), sourceFile.getFilePath(), efferentCount, grade, `Dieses Modul hat eine hohe Anzahl an Imports (${efferentCount}), was auf eine starke Kopplung hinweist`);
      }
      this.detailed.push({ moduleName: sourceFile.getBaseName(), filePath: sourceFile.getFilePath(), moduleScore: efferentCount, grade: grade })

      moduleScores.push(efferentCount);
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
`Gesamt-Komplexität: ${mapGradeToWording(this.grade)}`,
' ',
`**Interpretation der Werte:**`,
`| Score | Bewertung |`,
`| -------- | -------- |`,
`| 0 - 1 | Hervorragend (=1) |`,
`| 2 - 4 | Gut (=2) |`,
`| 5 - 7 | Okay (=3) |`,
`| 8 - 11 | Nicht Okay (=4) |`,
`| > 12 | Grauenvoll (=5) |`,
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
`- **Wende das Single Responsibility Principle (SRP) an:** Überprüfe, ob das Modul zu viele unterschiedliche Aufgaben übernimmt, welche die Nutzung verschiedener, unabhängiger Services erforderlich machen`,
`- **Wende das Dependency Inversion Principle (DIP) an:** Verwende Interfaces und Abstraktionen statt konkreter Klassen, um die direkte Abhängigkeit zu reduzieren (Inversion of Control/Dependency Injection)`,
`- **Übergib benötigte Daten über Funktionsparameter:** Vermeide den Import ganzer Services, nur um auf statische Konfigurationen oder Hilfsfunktionen zuzugreifen, die besser als Parameter oder einfache Utility-Funktionen übergeben werden könnten`,
].join('\n')
  }

  calculateCC(func: FunctionDeclaration) {
    let controllPaths = 0;

    func.forEachDescendant((node) => {
      const nodeType = node.getKind();
      switch (nodeType) {
        case SyntaxKind.IfStatement:
        case SyntaxKind.ForStatement:
        case SyntaxKind.ForOfStatement:
        case SyntaxKind.ForInStatement:
        case SyntaxKind.WhileStatement:
        case SyntaxKind.DoStatement:
        case SyntaxKind.CatchClause:
        case SyntaxKind.ConditionalExpression: // a < b ? a : b;
          controllPaths += 1;
          break;
        case SyntaxKind.BinaryExpression: // +, -, &&, ||
          const operator = node.asKind(SyntaxKind.BinaryExpression).getOperatorToken().getText();
          if (operator === '&&' || operator === '||') controllPaths += 1;
          break;
      }
    })

    return controllPaths + 1;
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
    if (score >= 0 && score <= 1) {
      return Grade.EXCELLENT;
    } else if (score > 1 && score <= 4) {
      return Grade.GOOD;
    } else if (score > 4 && score <= 7) {
      return Grade.OKAY;
    } else if (score > 7 && score < 12) {
      return Grade.NOT_GOOD;
    } else {
      return Grade.HORRIBLE;
    }
  }

}

export {
  EfferentCoupling,
}
