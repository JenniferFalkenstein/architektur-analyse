import { FunctionDeclaration, Project, SyntaxKind } from "ts-morph";
import { Algorithm } from "../interface";
import logger from "../../helper/logger";
import { Fuzzy, mapFuzzyToWording } from "../../global/fuzzy-metric";
import { ProjectStructureReport } from "../../helper/analyze-project-structure";
import { addAllFilesToProject } from "../../helper/ts-morph-project-helper";

class AfferentCoupling implements Algorithm {
  fuzzyScore: Fuzzy;
  name = "Kopplung";
  description = "Misst die **funktionale Kopplung** eines Moduls basierend auf der **Anzahl der von ihm importierten lokalen Module und Services**. Eine hohe Anzahl von Imports (Afferent Coupling) deutet auf eine geringe Unabhängigkeit, erhöhte Wartungskosten und eine geringere Testbarkeit des Moduls hin.";
  score: number;
  detailed: { filePath: string; moduleName: string; moduleScore: number; fuzzyScore?: number; details?: string; }[] = [];
  issues: { filePath: string; moduleName: string; moduleScore: number; fuzzyScore: Fuzzy; details: {   description?: string; }}[] = [];

  addToIssue(moduleName: string, filePath: string, moduleScore: number, fuzzyScore: number, description?: string) {
    this.issues.push({ moduleName, filePath, moduleScore, fuzzyScore, details: { description } });
  }

  calculate(projectStructure: ProjectStructureReport): void {
    logger.debug(`--------------------\nCOUPLING:`)
    const project = new Project();
    addAllFilesToProject(project, projectStructure.structure);

    const sourceFiles = project.getSourceFiles();
    const moduleScores: number[] = [];
    for (const sourceFile of sourceFiles) {
      let afferentCount = 0;
      const importDeclarations = sourceFile.getImportDeclarations();

      for (const importDeclaration of importDeclarations) {
        const importPath = importDeclaration.getModuleSpecifierValue();

        // Schließe nur relative Imports ein (also keine externen packages, wie z.B. node_modules, fs, etc.)
        if (importPath.startsWith('.') || importPath.startsWith('/')) {
          const sourceFilePath = importDeclaration.getSourceFile().getFilePath();

          if (projectStructure.flatModuleMap.includes(sourceFilePath)) {
            // Wenn das Modul bereits in im Zähl-Objekt vorhanden ist, addiere 1, sonst füge neu hinzu
            afferentCount += 1;
          }
        }
      }

      const fuzzyScore = this.evaluateScore(afferentCount);
      if (fuzzyScore === Fuzzy.NOT_GOOD || fuzzyScore === Fuzzy.HORRIBLE) {
        this.addToIssue(sourceFile.getBaseName(), sourceFile.getFilePath(), afferentCount, fuzzyScore, `Dieses Modul hat eine hohe Anzahl an Imports (${afferentCount}), was auf eine starke Kopplung hinweist`);
      }
      this.detailed.push({ moduleName: sourceFile.getBaseName(), filePath: sourceFile.getFilePath(), moduleScore: afferentCount, fuzzyScore: fuzzyScore })

      moduleScores.push(afferentCount);
    }

    const overAllScore = this.calculateMean(moduleScores);
    const overAllFuzzyScore = this.evaluateScore(overAllScore);
    this.fuzzyScore = overAllFuzzyScore;
    this.score = overAllScore;
  }

  interpreteResults(): string {
    return [
`**${this.name}**`,
' ',
`*Beschreibung: ${this.description}*`,
' ',
`Gesamt-Komplexität: ${mapFuzzyToWording(this.fuzzyScore)}`,
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
this.issues.sort((a, b) => b.fuzzyScore - a.fuzzyScore).map(issue => {
  return `| ${issue.filePath} | ${issue.moduleScore.toFixed(2)} (Fuzzy-Score: ${issue.fuzzyScore} = ${mapFuzzyToWording(issue.fuzzyScore)}) | ${issue.details.description} |`
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

  evaluateScore(score: number): Fuzzy {
    if (score >= 0 && score <= 1) {
      return Fuzzy.EXCELLENT;
    } else if (score > 1 && score <= 4) {
      return Fuzzy.GOOD;
    } else if (score > 4 && score <= 7) {
      return Fuzzy.OKAY;
    } else if (score > 7 && score < 12) {
      return Fuzzy.NOT_GOOD;
    } else {
      return Fuzzy.HORRIBLE;
    }
  }

}

export {
  AfferentCoupling,
}
