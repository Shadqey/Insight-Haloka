# Generated by Django 4.0.10 on 2023-03-19 08:48

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Layanan',
            fields=[
                ('deleted', models.DateTimeField(db_index=True, editable=False, null=True)),
                ('deleted_by_cascade', models.BooleanField(default=False, editable=False)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('service_name', models.CharField(max_length=256)),
                ('description_service', models.CharField(max_length=512)),
                ('project_duration', models.CharField(blank=True, db_index=True, max_length=32, null=True)),
                ('rentang_harga', models.CharField(blank=True, db_index=True, max_length=128, null=True)),
                ('example_proyek', models.CharField(blank=True, db_index=True, max_length=128, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
