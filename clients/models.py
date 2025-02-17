from django.db import models
from core.models import BaseModel
# Create your models here.
class Client(BaseModel):
    class ClientType:
        INDIVIDUAL = "Individual"
        CORPORATE = "Corporate"

    CLIENT_TYPE_CHOICES = {
        ClientType.INDIVIDUAL: "Individual", 
        ClientType.CORPORATE: "Corporate"
    }
    company_name = models.CharField(max_length=256)
    type = models.CharField(
        max_length=64, 
        choices=CLIENT_TYPE_CHOICES.items(),
    )
    phone = models.CharField(
        max_length=16, blank=True, null=True, db_index=True
    )
    email = models.EmailField(max_length=128, db_index=True)
