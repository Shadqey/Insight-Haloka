from clients.serializers import ClientSerializer, DetailClientSerializer
from contracts.serializers import ContractForInvoiceSerializer, ContractSerializer
from rest_framework import serializers

from products.serializers import ProductBundleLineForContractSerializer
from .models import *

class DetailAgreementSerializer(serializers.ModelSerializer):
    contract = ContractSerializer()
    client = ClientSerializer()