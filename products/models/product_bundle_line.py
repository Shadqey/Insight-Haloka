from django.db import models
from core.models import BaseModel
from products.models.product_bundle import ProductBundle
from products.models.product_line import ProductLine

class ProductBundleLine(BaseModel):
    product_bundle = models.ForeignKey(
        to=ProductBundle,
        on_delete=models.CASCADE,
        related_name="product_bundle_lines",
    )
    product_line = models.ForeignKey(
        to=ProductLine,
        on_delete=models.CASCADE,
        related_name="product_bundle_lines",
    )
