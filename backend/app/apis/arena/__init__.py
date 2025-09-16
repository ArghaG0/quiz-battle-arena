from fastapi import APIRouter
from pydantic import BaseModel, Field
import random
import time

router = APIRouter()


class AiAnswerRequest(BaseModel):
    difficulty: str = Field(description="AI difficulty level: easy | medium | hard | insane")


class AiAnswerResponse(BaseModel):
    ai_correct: bool


_DIFFICULTY_CHANCES = {
    "easy": 0.4,
    "medium": 0.6,
    "hard": 0.8,
    "insane": 0.95,
}


@router.post("/ai/decide")
def decide_ai_answer(body: AiAnswerRequest) -> AiAnswerResponse:
    """Decide if the AI answers correctly based on difficulty.

    Adds a small artificial delay for lifelike feel.
    """
    p = _DIFFICULTY_CHANCES.get(body.difficulty.lower())
    if p is None:
        # Default to medium if unknown
        p = _DIFFICULTY_CHANCES["medium"]
    # Small delay 300-900ms to feel more natural
    time.sleep(random.uniform(0.3, 0.9))
    return AiAnswerResponse(ai_correct=(random.random() < p))
