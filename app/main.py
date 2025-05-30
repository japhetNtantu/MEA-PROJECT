from fastapi import FastAPI
from app.initializer import init_application
import logging

logging.basicConfig(level="DEBUG")

app = FastAPI()

logging.info("Starting application initialization...")
init_application(application=app)
logging.info("Successfully initialized!")


@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}
