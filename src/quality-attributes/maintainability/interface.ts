import { Fuzzy } from "../../global/fuzzy-metric";
import { Score } from "../../types";
import { BaseQualityAttributeInterface } from "../base/interface";

interface MaintainabilityInterface extends BaseQualityAttributeInterface {
  score: {
    analyzability: Score;
    modifiability: Score;
    testability: Score;
    modularity: Score;
    reusability: Score;
  }
  weight: number;
  overallScore: Fuzzy;

  calculateAnalyzability(): void;
  calculateModifiability(): void;
  calculateTestability(): void;
  calculateModularity(): void;
  calculateReusability(): void;

  interpreteResults(): string;
}

export {
  MaintainabilityInterface,
}
