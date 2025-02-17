from rest_framework import serializers
from .models import Client

class DetailClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
        
class ListClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ('id', 'company_name', 'type', 'phone')

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ('id', 'company_name')