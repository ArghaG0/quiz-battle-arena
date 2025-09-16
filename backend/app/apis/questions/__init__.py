from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional
import random

router = APIRouter()


class QuestionModel(BaseModel):
    id: str
    question: str
    options: List[str]
    # NOTE: For the initial stub we include the correct answer in the payload
    # so the frontend can validate and animate quickly. We'll move validation to
    # the backend in a later phase once persistence and anti-cheat is in place.
    answer: str
    created_by: Optional[str] = Field(default=None, description="User ID of creator or None if system")


# Static pool for Phase 1/2 stub. Will be replaced by DB-backed storage in MYA-4.
_QUESTIONS_POOL: List[QuestionModel] = [
    QuestionModel(
        id="q1",
        question="What is the capital of France?",
        options=["Paris", "Berlin", "Madrid", "Rome"],
        answer="Paris",
        created_by=None,
    ),
    QuestionModel(
        id="q2",
        question="Which planet is known as the Red Planet?",
        options=["Earth", "Mars", "Jupiter", "Venus"],
        answer="Mars",
        created_by=None,
    ),
    QuestionModel(
        id="q3",
        question="Who wrote 'To Kill a Mockingbird'?",
        options=["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"],
        answer="Harper Lee",
        created_by=None,
    ),
    QuestionModel(
        id="q4",
        question="2 + 2 × 3 = ?",
        options=["8", "10", "12", "6"],
        answer="8",
        created_by=None,
    ),
]


@router.get("/questions/random")
def get_random_question() -> QuestionModel:
    """Return a random multiple-choice question from the static pool.

    This is an initial stub used by MYA-5 to enable the QuizBattle loop.
    Later this will draw from Postgres with user-submitted questions as well.
    """
    q = random.choice(_QUESTIONS_POOL)
    # Return a shallow copy to avoid accidental mutation
    return QuestionModel(**q.model_dump())
