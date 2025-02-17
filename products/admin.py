from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(ProductLine)
admin.site.register(Product)
admin.site.register(ProductBundle)
admin.site.register(ProductBundleLine)
