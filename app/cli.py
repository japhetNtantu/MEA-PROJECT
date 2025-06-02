import uuid
from getpass import getpass

import click
from tortoise import run_async
from tortoise import Tortoise

from app.config.db import TortoiseSettings
from app.models.users import Customer


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
