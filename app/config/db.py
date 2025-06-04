import os
 
from app.config.cfg import DEBUG
 
DB_MODELS = [
    "app.models.users",
    "app.models.pizza",
    "app.models.orders",
]
POSTGRES_DB_URL = "postgres://{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}"
SQLITE_DB_URL = "sqlite://db.sqlite3"
 
 
class PostgresSettings:
    postgres_user: str = os.getenv("POSTGRES_USER")
    postgres_password: str = os.getenv("POSTGRES_PASSWORD")
    postgres_db: str = os.getenv("POSTGRES_DB")
    postgres_port: str = os.getenv("POSTGRES_PORT")
    postgres_host: str = os.getenv("POSTGRES_HOST")
 
 
class TortoiseSettings:
    def __init__(self, db_url: str, modules: dict, generate_schemas: bool):
        self.db_url = db_url
        self.modules = modules
        self.generate_schemas = generate_schemas
 
    @classmethod
    def generate(cls):
        """Generate Tortoise-ORM settings (with sqlite if tests)"""
 
        if DEBUG:
            db_url = SQLITE_DB_URL
        else:
            postgres = PostgresSettings().__dict__
            db_url = POSTGRES_DB_URL.format(**postgres)
            del postgres
        modules = {"models": DB_MODELS}
        return TortoiseSettings(db_url=db_url, modules=modules, generate_schemas=True)
 
 