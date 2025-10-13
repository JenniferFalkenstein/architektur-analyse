import { Score } from "../../types";
import { BaseQualityAttributeInterface } from "../base/interface";

interface ReliabilityInterface extends BaseQualityAttributeInterface {
  weight: number;
  overallScore: number;
  score: {
    faultlessness: Score;
    availability: Score;
    faultTolerance: Score;
    recoverability: Score;
  }

  calculateOverallScore(): void;
  analyze(): void;

  calculateFaultlessness(): number;
  calculateAvailability(): number;
  calculateFaultTolerance(): number;
  calculateRecoverability(): number;
}

export {
  ReliabilityInterface,
}
