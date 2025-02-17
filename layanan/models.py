from django.db import models
from core.models import BaseModel

# Create your models here.
class Layanan(BaseModel):
    service_name = models.CharField(max_length=256)
    description_service = models.CharField(
        max_length=512, 
    )
    project_duration = models.CharField(
        max_length=32, blank=True, null=True, db_index=True
    )
    rentang_harga = models.CharField(
        max_length=128, blank=True, null=True, db_index=True
    )
    example_proyek = models.CharField(
        max_length=128, blank=True, null=True, db_index=True
    )
