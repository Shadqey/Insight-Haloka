from django.db import models
from core.models import BaseModel
from clients.models import Client
from contracts.models.contract import Contract
from products.models.product_bundle_line import ProductBundleLine
from products.models.product_line import ProductLine
from accounts.models.user import HalokaUser
from django.utils.text import slugify

class Invoice(BaseModel):
    contract = models.ForeignKey(
        to=Contract,
        on_delete=models.CASCADE,
        related_name="invoice_contracts",
    )
    client = models.ForeignKey(
        to=Client,
        on_delete=models.CASCADE,
        related_name="invoice_clients",
    )
    created_date = models.DateField(blank=True, null=True)
    total_price = models.DecimalField(decimal_places=2, max_digits=14)
    is_cancelled = models.BooleanField(default=False)
    
    cancelled_by = models.ForeignKey(
        to=HalokaUser,
        on_delete=models.CASCADE,
        related_name="invoice_clients",
        default=None,
        blank=True,
        null=True,
    )
    number = models.CharField(max_length=100, editable=False, default="INV")

    def capitalize_words(self, text):
        return ' '.join(word.upper() for word in text.split())

    def save(self, *args, **kwargs):
        if self.number == "INV":
            client_name_slug = self.capitalize_words(slugify(self.client.company_name)[:3])
            invoice_count = Invoice.objects.count() + 1
            self.number = f"INV/{str(invoice_count).zfill(3)}/{client_name_slug}"
        super().save(*args, **kwargs)

class InvoiceProductBundleLine(BaseModel):
    product_bundle_line = models.ForeignKey(
        to=ProductBundleLine,
        on_delete=models.CASCADE,
        related_name="invoice_product_bundle_lines",
    )
    invoice = models.ForeignKey(
        to=Invoice,
        on_delete=models.CASCADE,
        related_name="invoices",
    )