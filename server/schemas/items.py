from pydantic import BaseModel, Field
from datetime import datetime
from typing import List

# Creating Group
class ItemCreate(BaseModel):
    owner_id: int = Field(5)
    name: str = Field(..., min_length=0, max_length=48)
    course_code: str = Field(..., min_length=0, max_length=12) # CHANGE HERE
    description: str | None = Field(default=None, min_length=1, max_length=250)
    max_members: int = Field(..., ge=1, le=50)
    meeting_day: str = Field(..., min_length=0, max_length=8) # CHANGE HERE
    meeting_time: str = Field(..., min_length=0, max_length=8) # CHANGE HERE
    building: str = Field(..., min_length=1, max_length=32)
    room: str = Field(..., min_length=1, max_length=8)
    next_meeting: str = Field(..., min_length=12, max_length=32)

class ItemResponse(BaseModel):
    id: int
    message: str

# Joining/Leaving Group
class ItemChange(BaseModel):
    group_id: int
    user_id: int
    is_removing: bool

class ChangeResponse(BaseModel):
    message: str

# Retrieving/Searching/Browsing Groups
class GetItems(BaseModel):
    user_id: int
    is_search: bool
    course_code: str | None = Field(default=None, min_length=6, max_length=12) # CHANGE HERE

class GetGroup(BaseModel):
    owner_id: int
    course_code: str
    location: str
    datetime: datetime
    has_joined: bool

# Retrieving Group Specific Details
class GetItem(BaseModel):
    user_id: int
    group_id: int

class GroupDetail(BaseModel):
    owner_id: int
    course_code: str
    location: str
    datetime: datetime
    description: str
    attendees: List[str]
    has_joined: bool