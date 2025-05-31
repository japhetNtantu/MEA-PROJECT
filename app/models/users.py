from typing import Optional
from typing import Union

from tortoise import fields
from tortoise import models

from app.config import cfg


class Customer(models.Model):
    id = fields.UUIDField(primary_key=True)
    username = fields.CharField(max_length=20, unique=True)
    name = fields.CharField(max_length=50, blank=True)
    firstname = fields.CharField(max_length=50, null=True, blank=True)
    phone = fields.CharField(max_length=20)
    address = fields.CharField(max_length=50, null=True)
    password = fields.CharField(max_length=128)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    def full_name(self) -> str:
        if self.name or self.firstname:
            return f"{self.name or ''} {self.firstname or ''}".strip()
        return self.username

    def __str__(self):
        return self.username + " " + self.password

    def save(self, *args, **kwargs):
        if not self.password.startswith("$2b$"):
            self.password = self.get_password_hash(self.password)
        return super().save(*args, **kwargs)

    @classmethod
    async def get_user(cls, username: str) -> Optional["Customer"]:
        return await cls.get_or_none(username=username)

    def check_password(self, password: str) -> bool:
        return cfg.PWD_CONTEXT.verify(password, self.password)

    def get_password_hash(self, password) -> str:
        return cfg.PWD_CONTEXT.hash(password)

    @classmethod
    async def authenticate(
        cls, username: str, password: str
    ) -> Union[bool, "Customer"]:
        user = await cls.get_user(username=username)
        if not user or not user.check_password(password):
            return False
        return user

    class Meta:
        table = "customer_table"
        ordering = ["username"]
        indexes = ("id",)

    class PydanticMeta:
        computed = ["full_name"]
        exclude = ["password_hash"]
