import os

DEBUG = bool(os.getenv("API_TEST", default=True))
