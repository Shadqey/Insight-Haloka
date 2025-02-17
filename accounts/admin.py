from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# from rest_framework.authtoken.models import Token, TokenProxy

from accounts.forms import CreateHalokaUserForm
from accounts.models import HalokaUser




@admin.register(HalokaUser)
class HalokaUserAdmin(BaseUserAdmin):
    list_per_page = 50
    add_form = CreateHalokaUserForm
    add_fieldsets = (
        (
            "Detail",
            {
                'classes': ('wide',),
                'fields': (
                    'email',
                    'name',
                    'password',
                    'confirmation_password',
                    'is_staff',
                    'is_active',
                    'date_joined',
                    'groups',
                ),
            },
        ),
    )
    fieldsets = (
        (
            'Account Info',
            {
                'fields': [
                    'email',
                    'password',
                ]
            },
        ),
        (
            'Personal Info',
            {
                'fields': (
                    'name',
                    'date_joined',
                )
            },
        ),
        (
            'Permissions',
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'groups',
                )
            },
        ),
    )
    filter_horizontal = []
    list_filter = ['groups', 'is_active', 'is_staff']
    list_display = ['email', 'name', 'date_joined', 'is_active', 'is_staff', 'last_login']
    list_editable = ['is_active', 'is_staff']
    ordering = ['email']
    search_fields = ['email', 'name']

