from datetime import datetime
from decimal import Decimal
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
        from_attributes = True


class CustomerDetailModel(BaseModel):
    id: UUID
    username: str
    phone: str
    address: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CustomerDetailWithFullModel(CustomerDetailModel):
    name: Optional[str]
    firstname: Optional[str]
    password: str  # We keep it here but override its output
    is_superuser: bool

    class Config:
        from_attributes = True

    @property
    def masked_password(self) -> str:
        return "*****"

    def model_dump(self, *args, **kwargs):
        # Override to use the masked password in the output
        data = super().model_dump(*args, **kwargs)
        data["password"] = self.masked_password
        return data
    

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class LoginRequest(BaseModel):
    username: str
    password: str


class PizzaDetailModel(BaseModel):
    id: UUID
    image_url: str | None
    description: str | None
    price: Decimal

    class Config:
        orm_mode = True


class Status(BaseModel):
    message: str


class OrderCreatedModel(BaseModel):
    customer: UUID


class AddToCartRequest(BaseModel):
    customer_id: UUID
    pizza_id: UUID
    quantity: int


class PizzaCreateModel(BaseModel):
    image_url: str
    description: str
    price: Decimal

    class Config:
        from_attributes = True
