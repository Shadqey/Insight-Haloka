from rest_framework import serializers
from contracts.models.contract import Contract
from contracts.models.contract_product import ContractProduct
from products.serializers import ProductBundleSerializer, ProductForContractSerializer, ProductLineForContractSerializer, ProductSerializer
from clients.serializers import ClientSerializer, DetailClientSerializer

class CreateContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'

class CreateContractProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContractProduct
        fields = '__all__'

class ContractProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContractProduct
        fields = '__all__'

class ContractSerializer(serializers.ModelSerializer):
    contracts = ContractProductSerializer(many=True,read_only=True)
    client    = DetailClientSerializer(read_only=True)
    class Meta:
        model = Contract
        fields = '__all__'

class ContractProductForInvoiceSerializer(serializers.ModelSerializer):
    product = ProductForContractSerializer()
    class Meta:
        model = ContractProduct
        fields = ('product',)

class ContractForInvoiceSerializer(serializers.ModelSerializer):
    contracts = ContractProductForInvoiceSerializer(many=True)
    client = ClientSerializer()
    class Meta:
        model = Contract
        fields = ('id', 'client', 'start_date', 'end_date', 'status', 'contracts', 'number')