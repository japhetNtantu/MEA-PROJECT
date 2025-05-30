from fastapi import FastAPI
from tortoise.contrib.starlette import register_tortoise
from app.config import tortoise_config


def init_application(application: FastAPI) -> None:
    init_db(application=application)
    init_exceptions_handlers(application=application)


def init_db(application: FastAPI) -> None:
    register_tortoise(
        application,
        db_url=tortoise_config.db_url,
        generate_schemas=tortoise_config.generate_schemas,
        modules=tortoise_config.modules,
    )


def init_exceptions_handlers(application: FastAPI) -> None:
    from app.exceptions.handlers import tortoise_exception_handler
    from app.exceptions.handlers import BaseORMException

    application.add_exception_handler(BaseORMException, tortoise_exception_handler)
