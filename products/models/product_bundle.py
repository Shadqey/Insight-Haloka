from django.db import models
from core.models import BaseModel
from products.models.product import Product
class ProductBundle(BaseModel):
    product = models.ForeignKey(
        to=Product,
        on_delete=models.CASCADE,
        related_name="product_bundles",
    )
    unit_price = models.DecimalField(decimal_places=2, max_digits=14)