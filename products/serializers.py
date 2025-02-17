from rest_framework import serializers

from .models.product_bundle import ProductBundle
from .models.product import Product
from .models.product_line import ProductLine
from .models.product_bundle_line import ProductBundleLine

class ProductSerializer(serializers.ModelSerializer):
    product = serializers.CharField(read_only=True)
    class Meta:
        model = Product
        fields = '__all__'

class ProductLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLine
        fields = '__all__'

class ProductBundleSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='product.title', read_only=True)
    class Meta:
        model = ProductBundle
        fields = ('id', 'title', 'unit_price')

class ProductBundleLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBundleLine
        fields = '__all__'

# For Invoice
class ProductLineForContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLine
        fields = ('title', 'description', 'unit_price')

class ProductBundleLineForContractSerializer(serializers.ModelSerializer):
    product_line = ProductLineForContractSerializer()
    class Meta:
        model = ProductBundleLine
        fields = ('id', 'product_line',)

class ProductBundleForContractSerializer(serializers.ModelSerializer):
    product_bundle_lines = ProductBundleLineForContractSerializer(many=True)
    class Meta:
        model = ProductBundle
        fields = ('id','unit_price', 'product_bundle_lines')

class ProductForContractSerializer(serializers.ModelSerializer):
    product_bundles = ProductBundleForContractSerializer(many=True)
    class Meta:
        model = Product
        fields = ('id', 'title', 'product_bundles')