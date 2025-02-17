from rest_framework import serializers

from .models import Layanan


class LayananSerializer(serializers.ModelSerializer):
    class Meta:
        model = Layanan
        fields = ('id', 'service_name', 'description_service', 'project_duration', 'rentang_harga',
                  'example_proyek')