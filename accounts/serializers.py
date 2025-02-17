from accounts.models import HalokaUser

from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = HalokaUser
        fields = '__all__'

class DetailUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = HalokaUser
        fields = '__all__'