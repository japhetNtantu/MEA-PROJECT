from app.controllers.pizza import router as pizza_router
from app.controllers.user import router as user_router
from app.utils.api.router import TypedAPIRouter

users_router = TypedAPIRouter(router=user_router, prefix="/users", tags=["users"])
pizzas_router = TypedAPIRouter(router=pizza_router, prefix="/pizzas", tags=["pizzas"])

urlpatterns = [
    users_router,
    pizzas_router,
]
