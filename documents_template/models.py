from django.db import models

# Create your models here.
class DocumentTemplate(models.Model):
    class DocumentType:
        INVOICE = "Invoice"
        AGREEMENT = "Agreement"
    DOCUMENT_TYPE_CHOICES ={
        DocumentType.INVOICE: "Invoice",
        DocumentType.AGREEMENT: "Agreement"
    }
    document_section = models.CharField(max_length=256)
    type= models.CharField(
        max_length=64,
        choices= DOCUMENT_TYPE_CHOICES.items(),
    )
    content = models.TextField(blank=True)
