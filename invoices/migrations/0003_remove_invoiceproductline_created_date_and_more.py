# Generated by Django 4.0.10 on 2023-04-11 16:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contracts', '0001_initial'),
        ('products', '0005_remove_productline_product'),
        ('invoices', '0002_invoice_created_date_invoiceproductline'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='invoiceproductline',
            name='created_date',
        ),
        migrations.AlterField(
            model_name='invoice',
            name='contract',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invoice_contracts', to='contracts.contract'),
        ),
        migrations.AlterField(
            model_name='invoiceproductline',
            name='Invoice',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invoices', to='invoices.invoice'),
        ),
        migrations.AlterField(
            model_name='invoiceproductline',
            name='productLine',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invoice_productlines', to='products.productline'),
        ),
    ]
