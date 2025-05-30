from tortoise import fields
from tortoise import models


class Order(models.Model):
    id = fields.UUIDField(primary_key=True)
    customer = fields.ForeignKeyField("models.Customer", related_name="orders")
    created_at = fields.DatetimeField(auto_now_add=True)
    status = fields.CharField(
        max_length=20,
        default="pending",
        choices=[
            ("pending", "Pending"),
            ("preparing", "Preparing"),
            ("delivered", "Delivered"),
        ],
    )

    class Meta:
        table = "order_table"

    def __str__(self):
        return f"Order #{self.id} for {self.customer.name}"


class OrderItem(models.Model):
    id = fields.UUIDField(primary_key=True)
    order = fields.ForeignKeyField("models.Order", related_name="items")
    pizza = fields.ForeignKeyField("models.Pizza", related_name="order_items")
    quantity = fields.IntField()

    class Meta:
        table = "order_item_table"

    def __str__(self):
        return f"{self.quantity} x {self.pizza.id}"
