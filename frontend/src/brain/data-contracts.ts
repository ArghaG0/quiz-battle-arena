/** AiAnswerRequest */
export interface AiAnswerRequest {
  /**
   * Difficulty
   * AI difficulty level: easy | medium | hard | insane
   */
  difficulty: string;
}

/** AiAnswerResponse */
export interface AiAnswerResponse {
  /** Ai Correct */
  ai_correct: boolean;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** QuestionModel */
export interface QuestionModel {
  /** Id */
  id: string;
  /** Question */
  question: string;
  /** Options */
  options: string[];
  /** Answer */
  answer: string;
  /**
   * Created By
   * User ID of creator or None if system
   */
  created_by?: string | null;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type DecideAiAnswerData = AiAnswerResponse;

export type DecideAiAnswerError = HTTPValidationError;

export type GetRandomQuestionData = QuestionModel;
