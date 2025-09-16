import {
  AiAnswerRequest,
  CheckHealthData,
  DecideAiAnswerData,
  DecideAiAnswerError,
  GetRandomQuestionData,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Decide if the AI answers correctly based on difficulty. Adds a small artificial delay for lifelike feel.
   *
   * @tags dbtn/module:arena, dbtn/hasAuth
   * @name decide_ai_answer
   * @summary Decide Ai Answer
   * @request POST:/routes/ai/decide
   */
  decide_ai_answer = (data: AiAnswerRequest, params: RequestParams = {}) =>
    this.request<DecideAiAnswerData, DecideAiAnswerError>({
      path: `/routes/ai/decide`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Return a random multiple-choice question from the static pool. This is an initial stub used by MYA-5 to enable the QuizBattle loop. Later this will draw from Postgres with user-submitted questions as well.
   *
   * @tags dbtn/module:questions, dbtn/hasAuth
   * @name get_random_question
   * @summary Get Random Question
   * @request GET:/routes/questions/random
   */
  get_random_question = (params: RequestParams = {}) =>
    this.request<GetRandomQuestionData, any>({
      path: `/routes/questions/random`,
      method: "GET",
      ...params,
    });
}
