import { FunctionDeclaration, Project, SyntaxKind } from "ts-morph";
import { Algorithm } from "../interface";
import logger from "../../helper/logger";
import { Fuzzy, mapFuzzyToWording } from "../../global/fuzzy-metric";
import { ProjectStructureReport } from "../../helper/analyze-project-structure";
import { addAllFilesToProject } from "../../helper/ts-morph-project-helper";

class McCabeCyclomaticComplexity implements Algorithm {
  fuzzyScore: Fuzzy;
  name = "Zyklomatische Komplexität";
  description = "Misst die Zyklomatische Komplexität einer Methode basierend auf der **Anzahl unabhängiger Pfade** im Kontrollflussgraphen nach der Formel von McCabe. Ein hoher Wert (erzeugt durch beispielsweise viele Verzweigungen) deutet auf eine schwer verständliche, fehleranfällige und testintensive Methode hin.";
  score: number;
  detailed: { filePath: string; moduleName: string; moduleScore: number; fuzzyScore?: number; details?: string; }[] = [];
  issues: {
    filePath: string;
    moduleName: string;
    moduleScore: number;
    fuzzyScore: Fuzzy;
    details: {
      description?: string;
    };
  }[] = [];

  addToIssue(moduleName: string, filePath: string, moduleScore: number, fuzzyScore: number, description?: string) {
    this.issues.push({ moduleName, filePath, moduleScore, fuzzyScore, details: { description } });
  }

  calculate(projectStructure: ProjectStructureReport): void {
    logger.debug(`--------------------\nCYCLOMATIC COMPLEXITY:`)
    const project = new Project();
    addAllFilesToProject(project, projectStructure.structure);

    const sourceFiles = project.getSourceFiles();
    const moduleScores: number[] = [];
    for (const sourceFile of sourceFiles) {

      const functions = sourceFile.getFunctions();
      if (functions.length < 1) {
        logger.warn(`Die Datei ${sourceFile.getFilePath()} besitzt keine Funktionen zum Berechnen. Wird bei der Komplexitätsberechnung ignoriert...`);
        continue;
      }

      const functionScoresForModule: number[] = []
      const moduleIssues: string[] = [];

      // Berechne die Zyklomatische Komplexität jeder Funktion im Modul
      functions.forEach(func => {
        const functionScore = this.calculateCC(func);
        const functionFuzzyValue = this.evaluateScore(functionScore);
        functionScoresForModule.push(functionScore);

        if (functionFuzzyValue === Fuzzy.HORRIBLE || functionFuzzyValue === Fuzzy.NOT_GOOD) {
          moduleIssues.push(`Funktion ${func.getName()} hat eine Zyklomatische Komplexität von ${functionScore} (=${mapFuzzyToWording(functionFuzzyValue)})`);
        }
      });

      // Berechne die Zyklomatische Komplexität für das jeweilige Modul
      const moduleScore = this.calculateMean(functionScoresForModule);
      const moduleFuzzyScore = this.evaluateScore(moduleScore);

      this.detailed.push({
        filePath: sourceFile.getFilePath(),
        moduleName: sourceFile.getBaseName(),
        moduleScore: moduleScore,
        fuzzyScore: moduleFuzzyScore,
      })
      logger.debug(`${sourceFile.getFilePath()} has score of ${moduleScore} and Fuzzy of (=${mapFuzzyToWording(moduleFuzzyScore)})`);

      if (moduleIssues.length > 0) {
        const moduleName = sourceFile.getBaseName();
        const filePath = sourceFile.getFilePath();
        this.addToIssue(moduleName, filePath, moduleScore, moduleFuzzyScore, `${moduleIssues.join('')}`);
      }
      moduleScores.push(moduleScore);
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
`| 0 - 10 | Hervorragend (=1) |`,
`| 11 - 20 | Gut (=2) |`,
`| 21 - 30 | Okay (=3) |`,
`| 31 - 40 | Nicht Okay (=4) |`,
`| > 40 | Grauenvoll (=5) |`,
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
`- **Extrahiere (Refactoring):** Zerlege die komplexe Funktion in mehrere kleinere, spezialisierte Methoden. Jede extrahierte Methode sollte idealerweise eine Zyklomatische Komplexität von unter 10 aufweisen`,
`- **Vermeide tiefe Schachtelung:** Reduziere die Verschachtelungstiefe von \`if\`-Anweisungen, z.B. durch frühe Rückgabe bei Fehlerfällen oder ungültigen Zuständen`,
`- **Nutze Polymorphie:** Wenn die Verzweigungen auf unterschiedlichen Typen oder Zuständen basieren, nutze **Polymorphie** (Vererbung oder Interfaces) statt expliziter Typ- oder Zustandsprüfungen in der Funktion`,
`- **Kapsle Ausnahmebehandlung:** Prüfe, ob die Zählung von \`try/catch\`-Blöcken reduziert werden kann, indem die Fehlerbehandlung in dedizierte Schichten oder Wrapper-Funktionen ausgelagert wird`,
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
    if (score >= 0 && score <= 10) {
      return Fuzzy.EXCELLENT;
    } else if (score > 10 && score <= 20) {
      return Fuzzy.GOOD;
    } else if (score > 20 && score < 30) {
      return Fuzzy.NOT_GOOD;
    } else if (score > 30 && score < 40) {
      return Fuzzy.NOT_GOOD;
    } else {
      return Fuzzy.HORRIBLE;
    }
  }

}

export {
  McCabeCyclomaticComplexity,
}
