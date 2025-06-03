import uuid
from typing import Annotated

from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from fastapi.responses import JSONResponse
from tortoise.transactions import in_transaction

from app.auth.authentication import get_current_user
from app.models.orders import Order
from app.models.orders import OrderItem
from app.models.pizza import Pizza
from app.models.pydantic.serializers import AddToCartRequest
from app.models.users import Customer as User


router = APIRouter()


@router.post(
    "/cart",
    description="Add item selected to cart 😊",
)
async def add_to_cart(
    current_user: Annotated[User, Depends(get_current_user)],
    cart: AddToCartRequest = Body(...),
):
    if current_user is None:
        raise HTTPException(status_code=405, detail="User is not authenticated")

    pizza = await Pizza.get_or_none(id=cart.pizza_id)

    async with in_transaction():
        order, created = await Order.get_or_create(
            customer=current_user, status="pending", defaults={"id": uuid.uuid4()}
        )

        order_item = await OrderItem.get_or_none(order=order, pizza=pizza)

        if order_item:
            order_item.quantity += cart.quantity
            await order_item.save()
        else:
            order_item = await OrderItem.create(
                order=order,
                pizza=pizza,
                quantity=cart.quantity,
            )

            await order_item.save()

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"message": "purchase successfully"},
    )
