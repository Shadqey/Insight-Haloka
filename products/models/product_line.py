from django.db import models
from core.models import BaseModel
from products.models.product import Product
class ProductLine(BaseModel):
    title = models.CharField(max_length=64)
    description = models.TextField()
    unit_price = models.DecimalField(decimal_places=2, max_digits=14)