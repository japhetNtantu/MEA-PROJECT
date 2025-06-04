import os
from datetime import datetime
from pathlib import Path
from uuid import UUID

import pytest
from httpx import ASGITransport
from httpx import AsyncClient
from tortoise import Tortoise

os.environ["DEBUG"] = "True"
os.environ["DB_URL"] = "sqlite://:memory:"

try:
    from app.main import app
    from app.initializer import init_db
    from app.models.users import Customer
    from app.models.pydantic.serializers import CustomerDetailModel
    from app.config.db import TortoiseSettings
except ImportError:
    if (cwd := Path.cwd()) == (parent := Path(__file__).parent):
        dirpath = "."
    else:
        dirpath = str(parent.relative_to(cwd))
    print(
        f"You may need to explicitly declare python path:\n\nexport PYTHONPATH={dirpath}\n"
    )
    raise


@pytest.fixture(scope="module")
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture(scope="module", autouse=True)
async def initialize_db():
    # Initialize for tests
    settings = TortoiseSettings(
        db_url="sqlite://:memory:",
        modules={"models": ["app.models.users"]},
        generate_schemas=True,
    )
    await Tortoise.init(db_url=settings.db_url, modules=settings.modules)
    await Tortoise.generate_schemas()

    # Also initialize the FastAPI app's DB connection
    init_db(app)

    yield

    await Tortoise.close_connections()


@pytest.fixture
async def async_client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        yield client


class TestCustomerAPI:
    @pytest.mark.asyncio
    async def test_create_customer(self):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            customer_data = {
                "username": "testuser",
                "phone": "1234567890",
                "password": "securepassword",
                "name": "Test",
                "firstname": "User",
                "address": "123 Test St",
            }

            response = await client.post("/users/register", json=customer_data)
            assert response.status_code == 201, response.text
            data = response.json()

            assert "id" in data
            assert data["username"] == customer_data["username"]
            assert data["phone"] == customer_data["phone"]
            assert data["address"] == customer_data["address"]

            customer = await Customer.get(id=data["id"])
            assert customer.username == customer_data["username"]
            assert customer.phone == customer_data["phone"]

    @pytest.mark.asyncio
    async def test_get_customers(self):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            customer_data = {
                "username": "testuser2",
                "phone": "0987654321",
                "password": "anotherpassword",
            }
            response = await client.post("/users/register", json=customer_data)
            assert response.status_code == 201, response.text

            response = await client.get("/users/")
            assert response.status_code == 200, response.text
            data = response.json()

            assert isinstance(data, list)
            assert len(data) >= 1

            test_customer = next(
                (c for c in data if c["username"] == "testuser2"), None
            )
            assert test_customer is not None
            assert test_customer["phone"] == customer_data["phone"]

            customer_detail = CustomerDetailModel(**test_customer)
            assert isinstance(customer_detail.id, UUID)
            assert isinstance(customer_detail.created_at, datetime)
            assert isinstance(customer_detail.updated_at, datetime)
