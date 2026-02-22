from pydantic import BaseModel, Field

class UserSignIn(BaseModel):
    user_id: int

class UserDetail(UserSignIn):
    user_name: str
    groups_joined: int
    total_upcoming_groups: int
    active_users: int

class UserName(BaseModel):
    user_id: int

class UserNameReply(UserName):
    user_name: str