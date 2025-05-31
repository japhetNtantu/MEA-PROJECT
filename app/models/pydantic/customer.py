from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel
from pydantic import Field


class CustomerCreateOrUpdateModel(BaseModel):
    username: str = Field(..., max_length=20)
    name: Optional[str] = Field(None, max_length=50)
    firstname: Optional[str] = Field(None, max_length=50)
    phone: str = Field(..., max_length=20)
    address: Optional[str] = Field(None, max_length=50)
    password: str = Field(..., min_length=8)

    class Config:
        orm_mode = True


class CustomerDetailModel(BaseModel):
    id: UUID
    username: str
    phone: str
    address: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class LoginRequest(BaseModel):
    username: str
    password: str
