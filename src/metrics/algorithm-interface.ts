import { Grade } from "../global/grade-scale";

interface Algorithm {
  name: string;
  description: string;
  grade: Grade;
  detailed: { filePath: string, moduleName: string, moduleScore: number, grade?: number, details?: string }[]
  issues: { filePath: string; moduleName: string; moduleScore: number; details: any }[];

  calculate(...args: any): void;
  writeResult(): string;
  interpreteScore(score: number): Grade;
}

export {
  Algorithm
}
