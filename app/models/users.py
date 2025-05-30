from tortoise import fields
from tortoise import models


class Customer(models.Model):
    id = fields.UUIDField(primary_key=True)
    username = fields.CharField(max_length=20, unique=True)
    name = fields.CharField(max_length=50, blank=True)
    firstname = fields.CharField(max_length=50, null=True, blank=True)
    phone = fields.CharField(max_length=20)
    address = fields.CharField(max_length=50, null=True)
    password_hash = fields.CharField(max_length=128)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    def full_name(self) -> str:
        if self.name or self.firstname:
            return f"{self.name or ''} {self.firstname or ''}".strip()
        return self.username

    def __str__(self):
        return self.username

    class Meta:
        table = "customer_table"
        ordering = ["username"]
        indexes = ("id",)

    class PydanticMeta:
        computed = ["full_name"]
        exclude = ["password_hash"]
