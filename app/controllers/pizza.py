from typing import List
from uuid import UUID

from fastapi import APIRouter
from fastapi import HTTPException
from tortoise.contrib.pydantic import pydantic_model_creator

from app.models.pizza import Pizza
from app.models.pydantic.serializers import PizzaDetailModel
from app.models.pydantic.serializers import Status

pizza_pydantic = pydantic_model_creator(Pizza)

router = APIRouter()


@router.get("/", description="Get all pizzas", response_model=List[PizzaDetailModel])
async def get_all_pizzas() -> List[PizzaDetailModel]:
    pizzas = Pizza.all()
    return await pizza_pydantic.from_queryset(pizzas)


@router.get("/{pk}", response_model=PizzaDetailModel)
async def get_pizza_by_id(pk: UUID):
    pizza = await Pizza.get_or_none(id=pk)
    if not pizza:
        raise HTTPException(status_code=404, detail="Pizza not found")
    return PizzaDetailModel.model_validate(pizza)


@router.delete("/{pk}")
async def delete_pizza_by_id(pk: UUID):
    deleted_pizza = await Pizza.filter(id=pk).delete()
    if not deleted_pizza:
        raise HTTPException(status_code=404, detail=f"Pizza {pk} not found")
    return Status(message=f"Deleted pizza {pk}")
