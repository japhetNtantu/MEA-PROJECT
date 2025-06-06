import os

from passlib.context import CryptContext

DEBUG = bool(os.getenv("API_TEST", default=True))
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")
ADMIN_USER_MODEL = "Customer"
ADMIN_USER_MODEL_USERNAME_FIELD = "username"
ADMIN_SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
