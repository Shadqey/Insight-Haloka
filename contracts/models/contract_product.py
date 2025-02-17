from django.db import models
from core.models import BaseModel
from clients.models import Client
from contracts.models.contract import Contract
from products.models.product import Product

class ContractProduct(BaseModel):
    contract = models.ForeignKey(
        to=Contract,
        on_delete=models.CASCADE,
        related_name="contracts",
)
    product = models.ForeignKey(
        to=Product,
        on_delete=models.CASCADE,
        related_name="products",
    )