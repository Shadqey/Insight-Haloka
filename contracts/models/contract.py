from django.db import models
from core.models import BaseModel
from clients.models import Client
from django.utils.text import slugify

class Contract(BaseModel):
    class Status:
        DRAFT = "draft"
        IN_REVIEW = "in_review"
        APPROVED = "approved"

    STATUS_CHOICES = {
        Status.DRAFT: "Draft", 
        Status.IN_REVIEW: "In Review",
        Status.APPROVED: "Approved",
    }

    client = models.ForeignKey(
        to=Client,
        on_delete=models.CASCADE,
        related_name="client_contract",
    )
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    status = models.CharField(
        max_length=64, 
        choices=STATUS_CHOICES.items(),
    )
    last_email = models.CharField(
        max_length=64, 
        default="unknown"
    )
    link_mou = models.URLField(
        max_length=200,
        default="unknown"
    )
    number = models.CharField(max_length=100, editable=False, default="CTR")

    def capitalize_words(self, text):
        return ' '.join(word.upper() for word in text.split())

    def save(self, *args, **kwargs):
        if self.number == "CTR":
            client_name_slug = self.capitalize_words(slugify(self.client.company_name)[:3])
            contract_count = Contract.objects.count() + 1
            self.number = f"CTR/{str(contract_count).zfill(3)}/{client_name_slug}"
        super().save(*args, **kwargs)

    