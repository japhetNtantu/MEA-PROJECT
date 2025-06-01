from uuid import UUID

from fastadmin import TortoiseModelAdmin
from fastadmin import WidgetType

from app.models.users import Customer


class UserAdmin(TortoiseModelAdmin):
    exclude = ("password",)
    list_display = ("id", "username", "firstname", "phone")
    list_display_links = ("id", "username")
    list_filter = ("id", "username")
    search_fields = ("username",)
    formfield_overrides = {  # noqa: RUF012
        "username": (WidgetType.SlugInput, {"required": True}),
        "password": (WidgetType.PasswordInput, {"passwordModalForm": True}),
    }

    async def authenticate(self, username: str, password: str) -> int | None:
        user = await self.model_cls.filter(username=username, is_superuser=True).first()
        if not user:
            return None
        if not user.check_password(password.encode("utf-8").decode("utf-8")):
            return None
        return user.id

    async def change_password(self, id: UUID | int, password: str) -> None:
        user = await self.model_cls.filter(id=id).first()
        if not user:
            return
        user.password = Customer.get_password_hash(password)
        await user.save(update_fields=("password",))


class PizzaAdmin(TortoiseModelAdmin):
    list_display = ("id", "image_url", "price", "is_available")
    search_fields = ("is_available",)


class OrderAdmin(TortoiseModelAdmin):
    list_display = ("id", "customer", "status", "created_at")
    search_fields = ("customer",)


class OrderItemAdmin(TortoiseModelAdmin):
    list_display = ("id", "order", "pizza", "quantity")
    search_fields = ("order",)
