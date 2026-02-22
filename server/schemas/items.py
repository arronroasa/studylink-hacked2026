from pydantic import BaseModel, Field
from datetime import datetime
from typing import List

class ItemCreate(BaseModel):
    owner_id: int
    course_code: str = Field(..., min_length=6, max_length=12)
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
    user_id: int
    is_search: bool
    course_code: str | None = Field(default=None, min_length=6, max_length=12)

class GetGroup(GetItems):
    owner_id: int
    course_code: str
    location: str
    datetime: datetime
    has_joined: bool

class GetItem(BaseModel):
    user_id: int
    group_id: int

class GroupDetail(GetItem):
    owner_id: int
    course_code: str
    location: str
    datetime: datetime
    description: str
    attendees: List[str]
    has_joined: bool