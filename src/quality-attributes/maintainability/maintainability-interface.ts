import { Score } from "../../types";
import { BaseQualityAttributeInterface } from "../base/base-quality-attribute-interface";

interface MaintainabilityInterface extends BaseQualityAttributeInterface {
  subAttributes: {
    analyzability: Score;
    modifiability: Score;
    testability: Score;
    modularity: Score;
    reusability: Score;
  }

  calculateAnalyzability(): void;
  calculateModifiability(): void;
  calculateTestability(): void;
  calculateModularity(): void;
  calculateReusability(): void;
}

export {
  MaintainabilityInterface,
}
