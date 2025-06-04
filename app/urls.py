from app.controllers.orders import router as order_router
from app.controllers.pizza import router as pizza_router
from app.controllers.user import router as user_router
from app.utils.api.router import TypedAPIRouter

users_router = TypedAPIRouter(router=user_router, prefix="/users", tags=["users"])
pizzas_router = TypedAPIRouter(router=pizza_router, prefix="/pizzas", tags=["pizzas"])
orders_router = TypedAPIRouter(router=order_router, prefix="/orders", tags=["orders"])


urlpatterns = [
    users_router,
    pizzas_router,
    orders_router,
]
