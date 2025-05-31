import logging

from fastapi import FastAPI

from app.initializer import init_application

logging.basicConfig(level="ERROR")

app = FastAPI()

logging.info("Starting application initialization...")
init_application(application=app)
logging.info("Successfully initialized!")
