import logging
 
from fastadmin import fastapi_app as admin_app
from fastadmin import register
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
 
from app.initializer import init_application
from app.internal.admin import OrderAdmin
from app.internal.admin import OrderItemAdmin
from app.internal.admin import PizzaAdmin
from app.internal.admin import UserAdmin
from app.models.orders import Order
from app.models.orders import OrderItem
from app.models.pizza import Pizza
from app.models.users import Customer
 
logging.basicConfig(level="ERROR")
 
 
@register(Customer)
class CustomerAdmin(UserAdmin):
    pass
 
 
@register(Pizza)
class PizzaAdminDashboard(PizzaAdmin):
    pass
 
 
@register(Order)
class OrderAdminDashboard(OrderAdmin):
    pass
 
 
@register(OrderItem)
class OrderItemAdminDashboard(OrderItemAdmin):
    pass
 
 
app = FastAPI()
 
logging.info("Starting application initialization...")
init_application(app)
logging.info("Successfully initialized!")
 
app.mount("/admin", admin_app)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 