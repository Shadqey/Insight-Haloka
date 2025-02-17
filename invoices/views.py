from django.http import HttpResponse
from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import datetime
from accounts.permissions import *
from io import BytesIO
from django.template.loader import get_template
from django.views import View
from xhtml2pdf import pisa
from contracts.models import Contract, ContractProduct
from clients.models import Client
from contracts.serializers import ContractSerializer, ContractProductSerializer, CreateContractProductSerializer
from products.models import Product, ProductBundle
from products.serializers import ProductBundleSerializer, ProductSerializer
import uuid

# Create your views here.
class InvoiceView(APIView):
    
    permission_classes = [IsAuthenticated, IsFinance]

    def get(self, request, pk=None, format=None):
        if pk:
            data = self.get_object(pk)
            serializer = InvoiceSerializer(data)
        else :
            data = Invoice.objects.all()
            serializer = InvoiceSerializer(data, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        created_date = datetime.date.today()
        print(request.data['total_price'])
        data = {"contract":request.data['contract'],"client":request.data['client'], "total_price":request.data['total_price'],"created_date":created_date}
        serializer = InvoiceSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        invoice = serializer.save()

        product_bundle_lines = request.data['product_bundle_line']
        print(product_bundle_lines)
        for pbl in product_bundle_lines:
            data_ipbl = {"product_bundle_line":pbl, "invoice":invoice.id}
            serializer_ipbl = AddInvoiceProductBundleLineSerializer(data=data_ipbl)
            serializer_ipbl.is_valid(raise_exception=True)
            ipbl = serializer_ipbl.save()
            
        response = Response()
        response.data = {
            'message': 'Invoice Created Successfully',
            'data': serializer.data
        }
        return response

class ListInvoiceView(APIView):
    permission_classes = [IsAuthenticated, IsFinance]

    def get(self, request, id):
        contract = Contract.objects.get(id=id)
        invoices = Invoice.objects.filter(contract=contract).order_by('-created_at')
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)
    
class DetailInvoiceView(APIView):
    permission_classes = [IsAuthenticated, IsFinance]

    def get(self, request, id):
        invoice = Invoice.objects.get(id=id)
        serializer = DetailInvoiceSerializer(invoice)
        return Response(serializer.data)

def render_to_pdf(template_src, context_dict={}):
	template = get_template(template_src)
	html  = template.render(context_dict)
	result = BytesIO()
	pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
	if not pdf.err:
		return HttpResponse(result.getvalue(), content_type='application/pdf')
	return None

class ViewPDF(View):
	def get(self, request, id, *args, **kwargs):
                data = Invoice.objects.get(id=id)
                serializer = DetailInvoiceSerializer(data)
                invoice = serializer.data
                pdf = render_to_pdf('../templates/pdf-invoice.html', invoice)
                return HttpResponse(pdf, content_type='application/pdf')

class DownloadPDF(View):
	def get(self, request, id, *args, **kwargs):
                data = Invoice.objects.get(id=id)
                serializer = DetailInvoiceSerializer(data)
                invoice = serializer.data
                number = data.number

                pdf = render_to_pdf('../templates/pdf-invoice.html', invoice)
                response = HttpResponse(pdf, content_type="application/pdf")
                filename = "Invoivce-%s.pdf" %(data.number)
                content = "attachment; filename=%s" %(filename)
                response['Content-Disposition'] = content
                return response

class CancelInvoiceView(APIView):
    permission_classes = [IsAuthenticated, IsFinance]

    def get(self, request, pk=None, format=None):
        if pk:
            data = self.get_object(pk)
            serializer = InvoiceSerializer(data)
        else :
            data = Invoice.objects.all()
            serializer = InvoiceSerializer(data, many=True)
        return Response(serializer.data)
    
    def put(self, request, id, format=None):
        invoice = Invoice.objects.get(pk = id)
        invoice.is_cancelled = request.data["is_cancelled"]
        id_user = request.data["cancelled_by"]
        user = HalokaUser.objects.get(id=id_user)
        invoice.cancelled_by = user
        invoice.save()
        
        serializer = InvoiceCancelSerializer(invoice)
        return Response(serializer.data)
    
# Testing
class ContractView(APIView):
    # permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, id=None, format=None):
        if id:
            data = self.get_object(id)
            serializer = ContractSerializer(data)
        else :
            data = Contract.objects.all()
            serializer = ContractSerializer(data, many=True)
        return Response(serializer.data)
    
# Testing
class ContractProductOfContractView(APIView):
    # permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, id=None, format=None):
        if id:
            contract_products = ContractProduct.objects.filter(contract_id=id)
            serializer = MergeContractProductSerializer(contract_products, many=True)
        else :
            contract_products = ContractProduct.objects.all()
            serializer = MergeContractProductSerializer(contract_products, many=True)
        return Response(serializer.data)

# Testing
class ProductOfContractProductView(APIView):
    # permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, id=None, format=None):
        if id:
            contract_product = ContractProduct.objects.filter(id=id)
            product_id = contract_product[0].product.id
            products = Product.objects.filter(id=product_id)
            serializer = MergeProductSerializer(products, many=True)
        else :
            contract_product = ContractProduct.objects.filter(id=id)
            product_id = contract_product[0].product.id
            products = ContractProduct.objects.all()
            serializer = MergeProductSerializer(products, many=True)
        return Response(serializer.data)
    
        # contract_product = ContractProduct.objects.get(id=contract_product.contracts.id)
        # products = Product.objects.get(product=contract_product.products)
        # serializer = ProductSerializer(products)
        # return Response(serializer.data)
    
# Testing
class ProductBundleOfProductView(APIView):
    # permission_classes = [IsAuthenticated, IsManagerOrPartnership]
    
    def get(self, request, id=None, format=None):
        if id:
            product = Product.objects.get(id=id)
            product_bundle = ProductBundle.objects.filter(product_id=product.id)
            serializer = MergeProductBundleSerializer(product_bundle, many=True)
        else :
            product = Product.objects.filter(id=id)
            product_bundle = ProductBundle.objects.filter(product_id=id.id)
            serializer = MergeProductSerializer(product_bundle, many=True)
        return Response(serializer.data)
    
class ReportsView(APIView):
    def get(self, request, pk=None, format=None):
        if pk:
            data = self.get_object(pk)
            contract_serializer = ContractSerializer(data)
            contract_product_serializer = ContractProductSerializer(data)
            product_serializer = ProductSerializer(data)
        else :
            data = Contract.objects.all()
            contract_serializer = ContractSerializer(data, many=True)
            contract_product_serializer = ContractProductSerializer(data, many=True)
            product_serializer = ProductSerializer(data, many=True)

        client_company_name = []
        product_titles = [[]]
        statuses = []
        unit_prices = []
        
        contract_product = []
        product = []
        product_bundle = []
        
        for client in data.client:
            client_company_name.append(client)
            
        for cp in data:
            contract_product_obj = ContractProduct.objects.get(contracts=cp)
            contract_product.append(contract_product_obj)
            
        for cons in contract_product:
            for prod in cons.products:
                product_new = Product.objects.get(title=prod.title)
                product.append(product_new)
                
        for prod in product:
            product_bundle_new = ProductBundle.objects.get(product=prod)
            product_bundle.append(product_bundle_new)


        response_data = {
            'contracts': contract_serializer.data,
            'contract_products': contract_product_serializer.data,
            'products': product_serializer.data,
            'client_company_name': client_company_name,
            'product_titles': product_titles,
            'statuses': statuses,
            'unit_prices': unit_prices,
        }
        
        return Response(response_data)
    