# Generated by Django 4.0.10 on 2023-03-13 05:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_add_custom_groups'),
    ]

    operations = [
        migrations.AddField(
            model_name='halokauser',
            name='phone',
            field=models.CharField(blank=True, db_index=True, max_length=16, null=True),
        ),
    ]
