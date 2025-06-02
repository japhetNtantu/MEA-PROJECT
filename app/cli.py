import random
import uuid
from getpass import getpass

import click
from faker import Faker
from tortoise import run_async
from tortoise import Tortoise

from app.config.db import TortoiseSettings
from app.models.pizza import Pizza
from app.models.users import Customer

PIZZA_IMAGES = [
    "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg",
    "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_960_720.jpg",
    "https://cdn.pixabay.com/photo/2016/03/05/19/02/pizza-1238247_960_720.jpg",
]

fake = Faker()


@click.group()
def cli():
    """Management CLI for the app."""


@cli.command()
def createsuperuser():
    async def _create():
        settings = TortoiseSettings.generate()

        await Tortoise.init(db_url=settings.db_url, modules=settings.modules)
        if settings.generate_schemas:
            await Tortoise.generate_schemas()

        username = input("Username: ")
        if await Customer.filter(username=username).exists():
            click.echo("A user with that username already exists.")
            return

        password = getpass("Password: ")
        password2 = getpass("Confirm Password: ")

        if password != password2:
            click.echo("Passwords do not match.")
            return

        await Customer.create(
            id=uuid.uuid4(),
            username=username,
            name=username,
            firstname=None,
            password=password,
            phone="0782828282",
            address=None,
            is_superuser=True,
        )

        click.echo(f"Superuser '{username}' created successfully.")
        await Tortoise.close_connections()

    run_async(_create())


@cli.command()
def init_pizza_db():
    async def _init_pizza_db():
        settings = TortoiseSettings.generate()

        await Tortoise.init(
            db_url=settings.db_url,
            modules=settings.modules,
        )
        if settings.generate_schemas:
            await Tortoise.generate_schemas()

        for i in range(20):
            image_url = random.choice(PIZZA_IMAGES)
            description = fake.sentence(nb_words=10)
            price = round(random.uniform(5.99, 19.99), 2)

            await Pizza.create(
                id=uuid.uuid4(),
                image_url=image_url,
                description=description,
                price=price,
                is_available=True,
            )
            click.echo(f"🍕 Created pizza #{i + 1}: {image_url}")

        await Tortoise.close_connections()
        click.echo("✅ 20 pizzas added successfully!")

    run_async(_init_pizza_db())
