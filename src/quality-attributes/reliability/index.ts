import { Score } from "../../types";
import { ReliabilityInterface } from "./interface";

class Reliability implements ReliabilityInterface {
  weight: number = 1;
  overallScore: number = 0;
  score: {
    faultlessness: Score;
    availability: Score;
    faultTolerance: Score;
    recoverability: Score;
  }

  constructor(weight?: number) {
    if (weight !== undefined) {
      this.weight = weight;
    }
    // Initialisiere die Score-Werte mit Default-Werten
    this.score = {
      faultlessness: { value: 0, weight: 1 },
      availability: { value: 0, weight: 1 },
      faultTolerance: { value: 0, weight: 1 },
      recoverability: { value: 0, weight: 1 },
    }
  }

  calculateFaultlessness(): number {
    throw new Error("Method not implemented.");
  }
  calculateAvailability(): number {
    throw new Error("Method not implemented.");
  }
  calculateFaultTolerance(): number {
    throw new Error("Method not implemented.");
  }
  calculateRecoverability(): number {
    throw new Error("Method not implemented.");
  }

  analyze(): void {
    this.calculateFaultlessness();
    this.calculateAvailability();
    this.calculateRecoverability();
    this.calculateFaultTolerance();

    this.calculateOverallScore();
  }

  calculateOverallScore(): void {
    const keys = Object.keys(this.score);
    const values = Object.values(this.score);
    this.overallScore = values.reduce((currentNumber, score) => currentNumber + (score.value * score.weight), 0) / keys.length;
  }
}

export {
  Reliability
}
