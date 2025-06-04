
from typing import Annotated
from typing import List

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status


from app.auth.authentication import get_current_user
from app.models.pydantic.serializers import CustomerDetailWithFullModel
from app.models.users import Customer as User


router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Health check endpoint to verify the service is running.
    """
    return {"status": "ok", "message": "Service is running"}


async def get_admin_user(user: Annotated[User, Depends(get_current_user)]) -> User:
    if not user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user


@router.get(
    "/dashboard",
    description="Admin dashboard overview",
    response_model=dict,
)
async def admin_dashboard(
    admin_user: Annotated[User, Depends(get_admin_user)]
) -> dict:
    total_users = await User.all().count()
    return {"total_users": total_users, "admin": admin_user.username}


@router.get(
    "/users",
    description="List all users (admin only)",
    response_model=List[CustomerDetailWithFullModel],
)
async def list_users(
    admin_user: Annotated[User, Depends(get_admin_user)]
) -> List[CustomerDetailWithFullModel]:
    return await User.all()



