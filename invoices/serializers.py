from accounts.serializers import UserSerializer
from clients.serializers import ClientSerializer, DetailClientSerializer
from contracts.serializers import ContractForInvoiceSerializer
from rest_framework import serializers

from products.serializers import ProductBundleLineForContractSerializer
from .models import *
from contracts.models import Contract, ContractProduct
from products.models import Product, ProductBundle
from clients.models import Client

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

class AddInvoiceProductBundleLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceProductBundleLine
        fields = '__all__'

class InvoiceProductBundleLineSerializer(serializers.ModelSerializer):
    product_bundle_line = ProductBundleLineForContractSerializer()
    class Meta:
        model = InvoiceProductBundleLine
        fields = ('id', 'product_bundle_line')

class DetailInvoiceSerializer(serializers.ModelSerializer):
    contract = ContractForInvoiceSerializer()
    client = ClientSerializer()
    cancelled_by = UserSerializer()
    invoices = InvoiceProductBundleLineSerializer(many=True, read_only=True)
    class Meta:
        model = Invoice
        fields = ('id', 'client', 'created_date', 'total_price', 'is_cancelled', 'cancelled_by', 'contract', 'invoices', 'number')
        
class InvoiceCancelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'
        
class MergeContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'
        
class MergeClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
        

class MergeContractProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContractProduct
        fields = '__all__'
        
class MergeProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        
class MergeProductBundleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBundle
        fields = '__all__'
        
class MergeSerializer(serializers.ModelSerializer):
    contract = MergeContractSerializer()
    client = MergeClientSerializer()
    contract_product = MergeContractProductSerializer()
    product = MergeProductSerializer()
    product_bundle = MergeProductBundleSerializer()
    