# Generated by Django 4.0.10 on 2023-04-13 05:55

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_remove_productline_product'),
        ('invoices', '0005_rename_invoice_invoiceproductline_invoice_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='InvoiceProductBundleLine',
            fields=[
                ('deleted', models.DateTimeField(db_index=True, editable=False, null=True)),
                ('deleted_by_cascade', models.BooleanField(default=False, editable=False)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('invoice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invoices', to='invoices.invoice')),
                ('product_bundle_line', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invoice_product_bundle_lines', to='products.productbundleline')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.DeleteModel(
            name='InvoiceProductLine',
        ),
    ]
