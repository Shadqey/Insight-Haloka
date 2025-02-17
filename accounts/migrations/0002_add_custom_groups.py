from django.db import migrations
from django.contrib.auth.models import Group
def create_custom_groups(apps,schema_editor):
    Group.objects.get_or_create(name ='Executive')
    Group.objects.get_or_create(name ='Manager')
    Group.objects.get_or_create(name ='Partnership')
    Group.objects.get_or_create(name ='Finance')
def revert_create_custom_groups(apps,schema_editor):
    pass
class Migration(migrations.Migration):
    dependencies = [('accounts', '0001_initial')]
    operations = [migrations.RunPython(create_custom_groups, revert_create_custom_groups)]
