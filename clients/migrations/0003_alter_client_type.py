# Generated by Django 4.0.10 on 2023-04-01 07:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0002_client_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='type',
            field=models.CharField(choices=[('Individual', 'Individual'), ('Corporate', 'Corporate')], max_length=64),
        ),
    ]
