from pydantic import BaseModel


class Customer(BaseModel):
    id: int
    name: str
    username: str
    password_hash: str
    address: str
