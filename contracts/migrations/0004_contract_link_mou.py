# Generated by Django 4.0.10 on 2023-05-16 05:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contracts', '0003_alter_contract_last_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='contract',
            name='link_mou',
            field=models.URLField(default='unknown'),
        ),
    ]
