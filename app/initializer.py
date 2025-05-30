from fastapi import FastAPI
from tortoise.contrib.starlette import register_tortoise

from app.config import tortoise_config
from app.utils.api.router import TypedAPIRouter


def init_application(application: FastAPI) -> None:
    init_routers(application=application)
    init_db(application=application)
    init_exceptions_handlers(application=application)


def init_db(application: FastAPI) -> None:
    register_tortoise(
        application,
        db_url=tortoise_config.db_url,
        generate_schemas=tortoise_config.generate_schemas,
        modules=tortoise_config.modules,
    )


def init_routers(application: FastAPI):
    from app.urls import urlpatterns

    routers = [
        url_path for url_path in urlpatterns if isinstance(url_path, TypedAPIRouter)
    ]

    for router in routers:
        application.include_router(**router.model_dump())


def init_exceptions_handlers(application: FastAPI) -> None:
    from app.exceptions.handlers import tortoise_exception_handler
    from app.exceptions.handlers import http_exception_handler
    from app.exceptions.handlers import BaseORMException
    from app.exceptions.handlers import HTTPException

    application.add_exception_handler(BaseORMException, tortoise_exception_handler)
    application.add_exception_handler(HTTPException, http_exception_handler)
