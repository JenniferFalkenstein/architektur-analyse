import * as fs from 'fs';
import { ANALYZING_RESULTS_JSON_PATH, ANALYZING_RESULTS_MD_PATH } from '../global/global-variables';

type AnalyzingResults = {
  maintainability?: {
    score: number;
  },

}

function updateAnalyzingResults(results: AnalyzingResults): void {
  const jsonString = JSON.stringify(results, null, 2);
  fs.writeFileSync(ANALYZING_RESULTS_JSON_PATH, jsonString, 'utf-8');
  console.log(`Ergebnis wurde in die Datei ${ANALYZING_RESULTS_JSON_PATH} geschrieben.`);
}

function readAnalyzingResults(): AnalyzingResults {
  if (fs.existsSync(ANALYZING_RESULTS_JSON_PATH)) {
    const fileContent = fs.readFileSync(ANALYZING_RESULTS_JSON_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } else {
    return {};
  }
}

function interpreteAnalyzingResults(): void {
  const results = readAnalyzingResults();
  const content = `
# Gesamtanalyse
## Maintainability

Score: ${results}
Dies ist **fetter** Text.

- Listenpunkt 1
- Listenpunkt 2
`;
  fs.writeFileSync(ANALYZING_RESULTS_MD_PATH, content, 'utf-8');
}

export {
  updateAnalyzingResults,
  readAnalyzingResults,
  interpreteAnalyzingResults,
}
