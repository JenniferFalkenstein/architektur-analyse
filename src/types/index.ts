import { Fuzzy } from "../global/fuzzy-metric";

type LayeredArchitectureConfig = {
  layers: {
    name: string;
    path: string[];
    canOnlyDependOnLayers: string[];
  }[];
}

type Config = {
  structure: {
    backendPath: string;
    frontendPath: string;
    testsPath: string;
  }
  layeredArchitecture: LayeredArchitectureConfig
}

type Score = { weight: number, fuzzy: Fuzzy };

export type {
  Config,
  LayeredArchitectureConfig,
  Score
}
