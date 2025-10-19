import { FunctionDeclaration, Project, SourceFile, SyntaxKind } from "ts-morph";
import { Algorithm } from "../algorithm-interface";
import logger from "../../helper/logger";
import { Grade, mapGradeToWording } from "../../global/grade-scale";
import { ProjectStructureReport } from "../../helper/analyze-project-structure";
import { addAllFilesToProject } from "../../helper/ts-morph-project-helper";

class PropagationCost implements Algorithm {
  grade: Grade;
  name = "Propagation Cost (Ausbreitungskosten)";
  description = "Misst die Propagation Cost eines Moduls, indem die potenziellen Auswirkungen einer Änderung an diesem Modul auf andere abhängige Module analysiert werden. Hierbei werden nicht nur direkt abhängige Module analysiert, sondern auch indirekt abhängige. Beispiel: Modul A beeinflusst direkt Modul B. Modul C greift aber auch auf Modul B zu, daher wird Modul C indirekt von Modul A mitbeeinflusst. Ein hoher Wert deutet darauf hin, dass eine Änderung dieses Moduls eine **Kaskade von Folgeänderungen** oder umfangreiche Regressionstests in anderen Teilen der Anwendung erfordert.";
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
  moduleTree: {
    [modulePath: string]: {
      affectedModules: Set<string>,
      hasCycleDependency?: boolean,
      moduleName: string,
  }} = {};

  addToIssue(moduleName: string, filePath: string, moduleScore: number, grade: number, description?: string) {
    this.issues.push({ moduleName, filePath, moduleScore, grade, details: { description } });
  }

  isExternalPackage(pathname: string): boolean {
    if (pathname.startsWith('.') || pathname.startsWith('/')) return false;
    return true;
  }

  traverseImportTree(projectStructure: ProjectStructureReport, sourceFile: SourceFile, paths?: string[]) {
    const importDeclarations = sourceFile.getImportDeclarations();

    for (const importDeclaration of importDeclarations) {
      const importPath = importDeclaration.getModuleSpecifierValue();

      // Ignoriere den Import, wenn es ein externes Paket wie z.B. node_modules, fs, etc. ist
      if (this.isExternalPackage(importPath)) continue;
      const originSourceFile = importDeclaration.getModuleSpecifierSourceFile();
      const sourceFilePath = originSourceFile.getFilePath();

      // Wenn Dependency Zyklus gefunden wird
      if (paths.includes(sourceFilePath)) {
        logger.debug(`Zyklische Abhängigkeit gefunden: ${[...paths, sourceFilePath].join(' --> ')}`);
        this.addToModuleTree(sourceFile.getFilePath(), sourceFile.getBaseName(), paths);
        return;
      }

      // Überprüfe, ob das Modul innerhalb unseres Analyiserbereichs ist
      if (projectStructure.flatModuleMap.includes(sourceFilePath)) {
        const newPath = [...paths, sourceFilePath];
        this.traverseImportTree(projectStructure, originSourceFile, newPath);
      }
    }

    this.addToModuleTree(sourceFile.getFilePath(), sourceFile.getBaseName(), paths);
  }

  addToModuleTree(endFilePath: string, moduleName: string, affectedModulePaths: string[], hasCycleDependency: boolean = false): void {
    if(this.moduleTree[endFilePath]) {
      affectedModulePaths.forEach((modulePath) => this.moduleTree[endFilePath].affectedModules.add(modulePath));
      if (hasCycleDependency === true) {
        this.moduleTree[endFilePath].hasCycleDependency = true;
      }
    } else {
      this.moduleTree[endFilePath] = { moduleName, affectedModules: new Set(affectedModulePaths), hasCycleDependency };
    }
  }

  calculatePP(allModuleCount: number): number[] {
    const moduleScores: number[] = []
    for (const [modulePath, moduleInfo] of Object.entries(this.moduleTree)) {
      const score = moduleInfo.affectedModules.size / allModuleCount;
      const grade = this.interpreteScore(score);

      this.detailed.push({
        filePath: modulePath,
        moduleName: moduleInfo.moduleName,
        moduleScore: score,
        grade: grade,
      })

      if (grade === Grade.HORRIBLE || grade === Grade.NOT_GOOD) {
        this.addToIssue(moduleInfo.moduleName, modulePath, score, grade, `Dieses Modul hat eine hohe Propagation Cost von ${score.toFixed(2)}, da es ${moduleInfo.affectedModules.size} von insgesamt ${allModuleCount} Modulen beeinflusst`)
      }

      if (moduleInfo.hasCycleDependency) {
        this.addToIssue(moduleInfo.moduleName, modulePath, score, grade, `Dieses Modul hat einen Abhängigkeitszyklus mit anderen Modulen`)
      }
      moduleScores.push(score);
    }
    return moduleScores;
  }

  calculate(projectStructure: ProjectStructureReport): void {
    logger.debug(`--------------------\nPROPAGATION COST:`)
    const project = new Project();
    addAllFilesToProject(project, projectStructure.structure);

    // Ein Objekt aus dem Modul-Pfad und den Pfaden aller Dateien, die dieses Modul bei Änderungen potentiell verändert
    const sourceFiles = project.getSourceFiles();
    for (const sourceFile of sourceFiles) {
      this.traverseImportTree(projectStructure, sourceFile, [sourceFile.getFilePath()]);
    }

    // console.log('received following structure: ', this.moduleTree);
    const moduleScores = this.calculatePP(projectStructure.flatModuleMap.length);

    const overAllScore = this.calculateMean(moduleScores);
    const overallGrade = this.interpreteScore(overAllScore);
    this.grade = overallGrade;
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
`| 0 - 0.1 | Hervorragend (=1) |`,
`| > 0.1 - 0.2 | Gut (=2) |`,
`| > 0.2 - 0.3 | Okay (=3) |`,
`| > 0.3 - 0.5 | Nicht Okay (=4) |`,
`| > 0.5 | Grauenvoll (=5) |`,
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
`- **Reduziere die Anzahl der abhängigen Module (Efferent Coupling):** Versuche, die Anzahl der Stellen im Code zu verringern, die dieses Modul importieren, da jede dieser Stellen bei einer Änderung betroffen sein kann`,
`- **Wende das Dependency Inversion Principle (DIP) an:** Mache das Modul von Abstraktionen (Interfaces) abhängig statt von konkreten Implementierungen (Dependency Injection), um die Richtung der Abhängigkeit umzukehren`,
`- **Kapsle interne Details:** Mache Implementierungsdetails (z.B. interne Datenstrukturen, private Hilfsfunktionen) nicht über die öffentliche Schnittstelle zugänglich, um zu verhindern, dass externe Module von ihnen abhängig werden`,
`- **Vermeide globale veränderbare Zustände:** Stelle sicher, dass das Modul keinen globalen Zustand verwaltet oder ändert, auf den viele andere Module zugreifen, da dies zu unvorhersehbaren Seiteneffekten führt`,
`- **Definiere stabile Abstraktionen:** Wenn das Modul als zentraler Dienst (Hub) dient, sollte seine Schnittstelle (API) hochstabil sein, damit abhängige Module nicht ständig angepasst werden müssen`,
].join('\n')
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
    if (score >= 0 && score <= 0.1) {
      return Grade.EXCELLENT;
    } else if (score > 0.1 && score <= 0.2) {
      return Grade.GOOD;
    } else if (score > 0.2 && score <= 0.3) {
      return Grade.OKAY;
    } else if (score > 0.3 && score <= 0.5) {
      return Grade.NOT_GOOD
    } else {
      return Grade.HORRIBLE;
    }
  }

}

export {
  PropagationCost,
}
