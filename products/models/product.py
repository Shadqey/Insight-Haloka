from django.db import models
from core.models import BaseModel
class Product(BaseModel):
    title = models.CharField(max_length=64)
    def __str__(self):
        return self.title