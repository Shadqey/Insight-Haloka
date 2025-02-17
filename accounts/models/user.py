from django.db import models

# Create your models here.
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone
from accounts.managers import HalokaUserManager



class HalokaUser(AbstractBaseUser, PermissionsMixin):
    username = None
    email = models.EmailField(max_length=128, db_index=True, unique=True)
    name = models.CharField(max_length=128, db_index=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    
    objects = HalokaUserManager()

    USERNAME_FIELD = 'email'

    class Meta:
        db_table = 'user'
        verbose_name = 'Haloka User'
        verbose_name_plural = 'Haloka Users'
    
    def get_short_name(self):
        return self.email
    
    def get_groups(self):
        return ', '.join([group.name for group in self.groups.all()])
    
    def __str__(self):
        return str(self.email)