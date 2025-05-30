from fastapi import APIRouter

from app.models.pydantic.customer import Customer as PCustomer
from app.models.users import Customer

router = APIRouter()


@router.post("/", description="Create a new customer")
async def post(customer: PCustomer):
    i = await Customer.create(**customer.model_dump())
    await i.save()
    return {"response": "Successfully created new one"}


@router.get("/", description="Get all customer")
async def get() -> list[PCustomer]:
    items = await Customer.all()
    return items
