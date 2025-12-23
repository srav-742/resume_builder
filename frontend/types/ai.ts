export interface AIStep {
  step: string;
  observation: string[];
  suggestion: string[];
}

export interface AIResponse {
  steps: AIStep[];
}
