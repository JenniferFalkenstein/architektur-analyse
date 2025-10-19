import { Project } from "ts-morph";
import { Algorithm } from "../algorithm-interface";
import logger from "../../helper/logger";
import { splitCamelCase } from "../../helper/split-camel-case";
import { findSubDomainTermWithContext } from "../../helper/analyze-domain";
import { Grade, mapGradeToWording } from "../../global/grade-scale";
import { ProjectStructureReport } from "../../helper/analyze-project-structure";
import { addAllFilesToProject } from "../../helper/ts-morph-project-helper";

const THRESHOLD = 0.5;
const COHESION_MODE: 'STRICT' | 'LENIENT' = 'STRICT'; // STRICT = nur exakte Übereinstimmung in einem Modul, LENIENT = Sub-Domänen werden im Modul auch akzeptiert (aber mit geringerer Gewichtung)
const genericPrefixes = ['add', 'get', 'delete', 'set', 'update', 'create', 'fetch', 'remove'];
class MethodNameCohesion implements Algorithm {
  grade: Grade;
  name = "Methodennamen-Kohäsion";
  description = "Misst die funktionale Kohäsion eines Moduls, indem die semantische Ähnlichkeit der Methodennamen analysiert wird. Dabei wird untersucht, ob die Methodennamen gemeinsame Domänen- und, falls vorhanden, Sub-Domänen-Begriffe enthalten. Hohe Ähnlichkeit deutet auf eine Konzentration auf eine **einzelne Verantwortlichkeit (Single Responsibility Principle)** und somit auf eine höhere Kohäsion hin.";
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
    logger.debug(`--------------------\nCOHESION:`)
    const project = new Project();
    addAllFilesToProject(project, projectStructure.structure);

    const sourceFiles = project.getSourceFiles();
    const moduleScores: number[] = [];
    for (const sourceFile of sourceFiles) {

      const functions = sourceFile.getFunctions();
      if (functions.length < 1) {
        logger.warn(`Die Datei ${sourceFile.getFilePath()} besitzt keine Funktionen zum Berechnen. Wird bei der Kohäsionsberechnung ignoriert...`);
        continue;
      }
      const functionNames: string[] = [];
      functions.forEach(func => functionNames.push(func.getName()));

      const { score, issue } = this.checkNameCohesionInModule(functionNames);
      const grade = this.interpreteScore(score);

      this.detailed.push({
        filePath: sourceFile.getFilePath(),
        moduleName: sourceFile.getBaseName(),
        moduleScore: score,
        grade: grade,
      })
      logger.debug(`${sourceFile.getFilePath()} has score of ${score} and Grade of (=${mapGradeToWording(grade)})`);

      if (issue !== undefined) {
        const moduleName = sourceFile.getBaseName();
        const filePath = sourceFile.getFilePath();
        this.addToIssue(moduleName, filePath, score, grade, `${issue}`);
      }
      moduleScores.push(score);
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
`| > 0.8 - 1 | Hervorragend (=1) |`,
`| > 0.6 - 0.8 | Gut (=2) |`,
`| > 0.4 - 0.6 | Okay (=3) |`,
`| > 0.2 - 0.4 | Nicht Okay (=4) |`,
`| 0 - 0.2 | Grauenvoll (=5) |`,
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
`- Überprüfe, ob die enthaltenen Methoden dem **Single Responsibility Principle (SRP)** folgen, d.h., ob sie thematisch nur eine einzige Verantwortlichkeit verfolgen`,
`- **Extrahiere (Refactoring)** thematisch nicht zusammengehörige Funktionen in separate, dedizierte Module oder Services. Jedes Modul sollte eine klare Domäne oder Sub-Domäne abbilden`,
`- **Passe die Methodennamen an**, indem du konsistente Präfixe oder Namenskonventionen verwendest, die die Domäne des Moduls widerspiegeln (z.B. statt 'getId' und 'getData' lieber 'getUserId' und 'getUserData')`,
].join('\n')
  }

  checkNameCohesionInModule(functionNames: string[]): { score: number, issue?: string } {
    const functionCount = functionNames.length;
    if (functionCount <= 1) {
      logger.warn('Modul wird übersprungen, da nicht genügend exportierte Funktionen vorhanden sind, um eine Kohäsion zu bewerten (es werden mind. zwei benötigt).');
      return { score: 1 };
    }

    // 1. Extrahiere die Keywords anhand des CamelCase aus den Funktionsnamen, z.B. [[get, User, Cart], [delete, User, Cart]]
    const keywordsPerFunction: string[][] = functionNames.map(name => {
      let tokens = splitCamelCase(name);
      tokens = tokens.filter(t => !genericPrefixes.includes(t));
      return tokens;
    });

    // 2. Zähle Keyword-Häufigkeiten über alle Funktionen
    const keywordCounts: Record<string, number> = {};
    keywordsPerFunction.forEach(keywords => {
      const uniqueKeywords = new Set(keywords); // Doppelte Keywords pro Funktionsnamen rausfiltern

      uniqueKeywords.forEach(keyword => {
        const count = keywordCounts[keyword] || 0;
        keywordCounts[keyword] = count + 1;
      });
    });

    // 3. Finde das häufigste Keyword (falls vorhanden)
    const mostCommonKeywordArray = Object.entries(keywordCounts);
    mostCommonKeywordArray.sort((a, b) => b[1] - a[1]); // z.B. [ 'user', 3 ] verglichen mit [ 'cart', 2 ]
    const foundDomain = mostCommonKeywordArray[0]; // Das erste Element ist das häufigste Keyword

    if (!foundDomain || foundDomain[1] < 2) { // Wenn kein Keyword gefunden wurde oder das häufigste Keyword nur einmal vorkommt
      return { score: 0, issue: `Für dieses Modul konnte keine gemeinsame Hauptdomäne gefunden werden. Kohäsion ist daher nicht gegeben!`};
    }

    // 4. Überprüfe, ob es eine Sub-Domäne gibt (z.B. "UserCart" statt nur "User")
    const foundSubDomains = new Set<string>();
    keywordsPerFunction.forEach((keywords) => {
        const subDomainTerm = findSubDomainTermWithContext(foundDomain[0], keywords);
        if (subDomainTerm) {
          foundSubDomains.add(subDomainTerm);
        }
    })

    const subDomainWordCount: Record<string, number> = Array.from(foundSubDomains).reduce((acc, word) => {
      const wordCount = functionNames.filter(name => name.includes(word)).length;
      acc[word] = wordCount;
      return acc;
    }, {});

    logger.info(`Gefundene Sub-Domains: ${JSON.stringify(subDomainWordCount)}`);
    const mostCommonSubDomain = Object.entries(subDomainWordCount);
    mostCommonSubDomain.sort((a, b) => b[1] - a[1]); // z.B. [ 'user', 3 ] verglichen mit [ 'cart', 2 ]
    const foundSubDomain = mostCommonSubDomain[0]; // Das erste Element ist das häufigste Keyword

    // 5. Score = Anteil der Funktionen mit diesem Keyword
    const score = this.calculateCohesionScore(functionNames.length, foundDomain[1], foundSubDomain ? foundSubDomain[1] : 0)
    // const scoreLenient = this.calculateCohesionScore(functionNames.length, foundDomain[1], foundSubDomain ? foundSubDomain[1] : 0, 'LENIENT')

    if (score < THRESHOLD) {
      const notMatchingFunctions = functionNames.filter(name => !name.includes(foundDomain[0]) && !(foundSubDomain && name.includes(foundSubDomain[0]))).join(', ');
      return { score, issue: `Kohäsion wird durch folgende Funktionen beeinträchtig, da sie weder mit der Hauptdomäne ("${foundDomain[0]}"), noch mit der Sub-Domäne (${foundSubDomain ? foundSubDomain[0] : 'Keine Subdomäne gefunden'}) übereinzustimmen scheinen: ${notMatchingFunctions}` }
    }
    return { score };
  }

  calculateMean(scores: number[]): number {
    if (scores.length === 0) {
      logger.warn('Keine Werte vorhanden, um einen Gesamtwert zu berechnen.');
      return;
    }
    const overAllScore = scores.reduce((acc, val) => acc + val, 0) / scores.length;
    return overAllScore;
  }

  calculateCohesionScore(functionCount: number, domainCount: number, subDomainCount: number, mode = COHESION_MODE): number {
    const hasOnlySubdomains = domainCount > 0 && domainCount === subDomainCount;
    if (hasOnlySubdomains) return 1;

    switch (mode) {
      case 'STRICT':
        return (domainCount - subDomainCount) / functionCount;
      case 'LENIENT':
        return ((domainCount - subDomainCount) + (0.5 * subDomainCount)) / functionCount;
      default:
        return 0;
    }
  }

  interpreteScore(score: number): Grade {
    if (score >= 0 && score <= 0.2) {
      return Grade.HORRIBLE;
    } else if (score > 0.2 && score <= 0.4) {
      return Grade.NOT_GOOD;
    } else if (score > 0.4 && score <= 0.6) {
      return Grade.OKAY;
    } else if (score > 0.6 && score <= 0.8) {
      return Grade.GOOD
    } else {
      return Grade.EXCELLENT;
    }
  }

}

export {
  MethodNameCohesion,
}
