from typing import Any
from typing import Dict
from typing import Optional

from fastapi import Request
from fastapi.responses import JSONResponse
from tortoise.exceptions import BaseORMException


class HTTPException(Exception):
    def __init__(
        self,
        status_code: int,
        content: Any = None,
        headers: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Initialize HTTPException class object instance.

        Args:
            status_code (int): HTTP error status code.
            content (Any): Response body.
            headers (Optional[Dict[str, Any]]): Additional response headers.

        """
        self.status_code = status_code
        self.content = content
        self.headers = headers

    def __repr__(self) -> str:
        kwargs = []

        for key, value in self.__dict__.items():
            if not key.startswith("_"):
                kwargs.append(f"{key}={value!r}")

        return f"{self.__class__.__name__}({', '.join(kwargs)})"


async def tortoise_exception_handler(
    request: Request, exc: BaseORMException
) -> JSONResponse:
    return JSONResponse(
        status_code=418,
        content={"message": f"Something went wrong.. And it is that: {repr(exc)}"},
    )


async def http_exception_handler(
    request: Request, exception: HTTPException
) -> JSONResponse:
    return JSONResponse(
        status_code=exception.status_code,
        content=exception.content,
        headers=exception.headers,
    )
