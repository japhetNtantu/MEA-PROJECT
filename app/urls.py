from app.controllers.user import router as user_router
from app.utils.api.router import TypedAPIRouter

users_router = TypedAPIRouter(router=user_router, prefix="/users", tags=["users"])

urlpatterns = [
    users_router,
]
