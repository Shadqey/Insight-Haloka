# Generated by Django 4.0.10 on 2023-03-12 07:43

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('deleted', models.DateTimeField(db_index=True, editable=False, null=True)),
                ('deleted_by_cascade', models.BooleanField(default=False, editable=False)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('company_name', models.CharField(max_length=256)),
                ('type', models.CharField(choices=[('individual', 'Individual'), ('corporate', 'Corporate')], max_length=64)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
