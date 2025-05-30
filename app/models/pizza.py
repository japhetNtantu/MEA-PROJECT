from tortoise import fields
from tortoise import models

from app.utils import validators


class Pizza(models.Model):
    id = fields.UUIDField(primary_key=True)
    image_url = fields.CharField(
        max_length=500, null=True, validators=[validators.validate_url]
    )
    description = fields.TextField(null=True)
    price = fields.DecimalField(max_digits=6, decimal_places=2)
    is_available = fields.BooleanField(default=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "pizza_table"

    def __str__(self):
        return "This pizza is available %s" % self.is_available
