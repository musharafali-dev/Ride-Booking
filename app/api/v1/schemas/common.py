from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List

T = TypeVar('T')

class MessageResponse(BaseModel):
    message: str

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    limit: int
    offset: int
