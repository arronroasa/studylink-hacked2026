from pydantic import BaseModel, Field
from datetime import datetime
from typing import List

# Creating/Deleting Group
class ItemCreate(BaseModel):
    owner_id: int 
    name: str = Field(..., max_length=48)
    course_code: str = Field(..., max_length=12)
    description: str | None = Field(default=None, max_length=250)
    max_members: int = Field(default=10, ge=1, le=100)
    meeting_day: str = Field(..., max_length=20)
    meeting_time: str = Field(..., max_length=20)
    building: str = Field(..., max_length=100)
    room: str = Field(..., max_length=20)
    next_meeting: str

class ItemResponse(BaseModel):
    id: int
    message: str

class ItemDelete(BaseModel):
    user_id: int = Field(..., le=100)
    group_id: int

# Joining/Leaving Group
class ItemChange(BaseModel):
    group_id: int
    user_id: int = Field(..., le=100)

class ChangeResponse(BaseModel):
    message: str

# Retrieving/Searching/Browsing Groups
class GetItems(BaseModel):
    user_id: int = Field(..., le=100)
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