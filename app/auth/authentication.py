from datetime import datetime
from datetime import timedelta
from datetime import timezone
from typing import Annotated
from typing import Any

import jwt
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError

from app.config import cfg
from app.models.pydantic.serializers import TokenData
from app.models.users import Customer as User

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login",
    description="JWT Bearer token. Use your /login endpoint to obtain one.",
)


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload: dict[str, Any] = jwt.decode(
            token, cfg.SECRET_KEY, algorithms=[cfg.ALGORITHM]
        )
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = await User.get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, cfg.SECRET_KEY, algorithm=cfg.ALGORITHM)
    return encoded_jwt
