from pydantic import BaseModel, Field
from datetime import datetime

class ItemCreate(BaseModel):
    owner_id: int
    course_code: str = Field(..., min_length=6, max_length=7)
    location: str = Field(..., min_length=1, max_length=250)
    datetime: datetime
    description: str | None = Field(default=None, min_length=1, max_length=250)

class ItemResponse(ItemCreate):
    id: int
    message: str

class ItemChange(BaseModel):
    group_id: int
    user_id: int
    is_removing: bool

class ChangeResponse(ItemChange):
    id: int
    message: str

class GetItems(BaseModel):
    user_id: int | None

class GetGroup(BaseModel):
    owner_id: int
    course_code: str
    location: str
    datetime: datetime
    description: str