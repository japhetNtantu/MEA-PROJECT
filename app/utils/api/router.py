import typing

from fastapi import APIRouter
from fastapi.params import Depends
from pydantic import BaseModel
from starlette.responses import JSONResponse
from starlette.responses import Response


class TypedAPIRouter(BaseModel):
    router: APIRouter
    prefix: str = str()
    tags: typing.List[str] = []
    dependencies: typing.List[Depends] = []
    responses: typing.Dict[
        typing.Union[int, str], typing.Dict[str, typing.Any]
    ] = dict()
    default_response_class: typing.Optional[typing.Type[Response]] = JSONResponse

    class Config:
        arbitrary_types_allowed = True
