import { AiAnswerRequest, CheckHealthData, DecideAiAnswerData, GetRandomQuestionData } from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Decide if the AI answers correctly based on difficulty. Adds a small artificial delay for lifelike feel.
   * @tags dbtn/module:arena, dbtn/hasAuth
   * @name decide_ai_answer
   * @summary Decide Ai Answer
   * @request POST:/routes/ai/decide
   */
  export namespace decide_ai_answer {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AiAnswerRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DecideAiAnswerData;
  }

  /**
   * @description Return a random multiple-choice question from the static pool. This is an initial stub used by MYA-5 to enable the QuizBattle loop. Later this will draw from Postgres with user-submitted questions as well.
   * @tags dbtn/module:questions, dbtn/hasAuth
   * @name get_random_question
   * @summary Get Random Question
   * @request GET:/routes/questions/random
   */
  export namespace get_random_question {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetRandomQuestionData;
  }
}
