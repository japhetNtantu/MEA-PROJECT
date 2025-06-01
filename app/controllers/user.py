from datetime import timedelta
from typing import Annotated
from typing import List

from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from app.auth.authentication import create_access_token
from app.auth.authentication import get_current_user
from app.config import cfg
from app.models.pydantic.customer import CustomerCreateOrUpdateModel
from app.models.pydantic.customer import CustomerDetailModel
from app.models.pydantic.customer import LoginRequest
from app.models.pydantic.customer import Token
from app.models.users import Customer as User

router = APIRouter()


@router.post(
    "/register",
    description="Create a new customer",
    response_model=CustomerCreateOrUpdateModel,
    status_code=status.HTTP_201_CREATED,
)
async def post(customer: CustomerCreateOrUpdateModel = Body(...)):
    user = await User.get_or_none(username=customer.username)
    if user:
        raise HTTPException(status_code=400, detail="Username already registered")
    user = await User.create(**customer.model_dump())
    await user.save()
    return user


@router.get(
    "/", description="Get all customer", response_model=List[CustomerDetailModel]
)
async def get() -> List[CustomerDetailModel]:
    items = await User.all()
    return items


@router.post("/login")
async def login(credentials: LoginRequest = Body(...)):
    user = await User.authenticate(credentials.username, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=cfg.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.get(
    "/me",
    description="Get current authenticate user",
    response_model=CustomerDetailModel,
)
async def me(
    user: Annotated[CustomerDetailModel, Depends(get_current_user)]
) -> CustomerDetailModel:
    return user
