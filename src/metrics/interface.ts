import { Fuzzy } from "../global/fuzzy-metric";

interface Algorithm {
  name: string;
  description: string;
  fuzzyScore: Fuzzy;
  // issues: {
  //   [filePath: string]: {
  //     moduleName: string,
  //     moduleScore: number,
  //     fuzzyScore: Fuzzy,
  //     details: any,
  //   }
  // }
  detailed: { filePath: string, moduleName: string, moduleScore: number, fuzzyScore?: number, details?: string }[]
  issues: {
    filePath: string;
    moduleName: string;
    moduleScore: number;
    details: any;
  }[];

  calculate(...args: any): void;
  interpreteResults(): string;
}

export {
  Algorithm
}
