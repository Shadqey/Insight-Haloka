from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from accounts.models import HalokaUser


class CreateHalokaUserForm(forms.ModelForm):
    password = forms.CharField(label='Password', widget=forms.PasswordInput)
    confirmation_password = forms.CharField(
        label='Confirmation Password', widget=forms.PasswordInput
    )

    class Meta:
        model = HalokaUser
        fields = (
            'is_staff',
            'is_active',
            'email',
            'name',
            'password',
            'confirmation_password',
            'date_joined',
            'groups',
        )



    def clean_confirmation_password(self):
        password = self.cleaned_data.get('password')
        confirmation_password = self.cleaned_data.get('confirmation_password')
        if password and confirmation_password and (password != confirmation_password):
            self.add_error(
                'confirmation_password', 'Password and confirmation password do not match'
            )
        return password

    def save(self, commit=True):
        haloka_user = super().save(commit=False)
        haloka_user.set_password(self.cleaned_data['password'])
        if commit:
            haloka_user.save()
        return haloka_user


class ChangeHalokaUserForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(
        label='Password',
        help_text=(
            "Raw passwords are not stored, so there is no way to see "
            "this user's password, but you can change the password "
            "using <a href=\"../password/\">this form</a>."
        ),
    )

    class Meta:
        model = HalokaUser
        fields = ( 'password', 'name', 'is_staff', 'is_superuser')