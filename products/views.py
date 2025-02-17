from django.shortcuts import get_object_or_404
from rest_framework import generics,status
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from products.models.product_bundle import ProductBundle
from products.models.product import Product
from products.models.product_line import ProductLine
from .serializers import *
from .models.product_bundle import ProductBundle
from .models.product_line import ProductLine
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import *

# Create your views here.
class ProductView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, pk=None, format=None):
        if pk:
            data = self.get_object(pk)
            serializer = ProductSerializer(data)
        else :
            data = Product.objects.all()
            serializer = ProductSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        data_product = {"title":request.data['title']}
        serializer_product = ProductSerializer(data=data_product)
        serializer_product.is_valid(raise_exception=True)
        product = serializer_product.save()

        data_pb = {"product": product.id, "unit_price":request.data['unit_price']}
        serializer = ProductBundleSerializer(data=data_pb)
        serializer.is_valid(raise_exception=True)
        product_bundle = serializer.save(product_id=product.id)

        product_lines = request.data['product_line']
        for dic in product_lines:
            if (("isChecked" in dic) and (dic["isChecked"])):
                data_pl = {"product_bundle": product_bundle.id, "product_line":dic["id"]}
                serializer_pl = ProductBundleLineSerializer(data=data_pl)
                serializer_pl.is_valid(raise_exception=True)
                serializer_pl.save()

        response = Response()
        response.data = {
            'message': 'Product Created Successfully',
            'product': serializer_product.data,
            'product_bundle': serializer.data
        }

        return response
    
class ProductLineView(APIView):
    
    permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, pk=None, format=None):
        if pk:
            data = self.get_object(pk)
            serializer = ProductLineSerializer(data)
        else :
            data = ProductLine.objects.all()
            serializer = ProductLineSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        data = request.data
        serializer = ProductLineSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response = Response()
        response.data = {
            'message': 'Product Line Created Successfully',
            'data': serializer.data
        }

        return response
    
class DeleteProductLineView(APIView):
    
    permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, id):
        try:
            return ProductLine.objects.get(pk=id)
        except ProductLine.DoesNotExist:
            raise Http404
    
    def delete(self, request, id, format=None):
        product = ProductLine.objects.get(pk=id)
        serializer = ProductLineSerializer(product)

        product_bundle_lines = ProductBundleLine.objects.filter(product_line=product)
        for product_bundle_line in product_bundle_lines:
            pb = product_bundle_line.product_bundle
            pb.unit_price -= product.unit_price
            pb.save()

        product.delete()
        return Response({"Message": "Success", "data":serializer.data}, status= status.HTTP_202_ACCEPTED)
    

class UpdateProductLineView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, id):
        try:
            return ProductLine.objects.get(pk=id)
        except ProductLine.DoesNotExist:
            raise Http404
        
    def put(self, request, id, format=None):
        product = ProductLine.objects.get(pk = id)
        product.title = request.data["title"]
        product.description = request.data["description"]
        product.unit_price = request.data["unit_price"]
        product.save()
        
        serializer = ProductLineSerializer(product)
        return Response(serializer.data)
    
class DetailProductLineView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    queryset = ProductLine.objects.all()
    serializer_class = ProductLineSerializer
    lookup_field = 'id'

    
class ProductBundleView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, pk=None, format=None):
        if pk:
            data = self.get_object(pk)
            serializer = ProductBundleSerializer(data)
        else :
            data = ProductBundle.objects.all()
            serializer = ProductBundleSerializer(data, many=True)
        return Response(serializer.data)

class ProductBundleLineView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, id):
        data = ProductLine.objects.filter(product_bundle_lines__product_bundle=id).values()
        serializer = ProductLineSerializer(data.all(), many=True)
        return Response(serializer.data)

class ProductBundleObjectView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, id):
        data = self.get_object(id)
        serializer = ProductBundleSerializer(data)
        return Response(serializer.data)
    
    def get_object(self, id):
        id = self.kwargs.get('id')
        return get_object_or_404(ProductBundle, id=id)
    

class DeleteProductView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, id):
        try:
            return Product.objects.get(pk=id)
        except ProductBundle.DoesNotExist:
            raise Http404
    
    def delete(self, request, id, format=None):
        # product = Product.objects.get(pk=id)
        product_real = ProductBundle.objects.get(pk=id)
        # product = Product.objects.get(pk=product_real.title)
        product = Product.objects.get(title=product_real.product)
        serializer = ProductBundleSerializer(product_real)
        # product = Product.objects.get(id=id)
        # product_bundle = ProductBundle.objects.get(product=product)
        # serializer = ProductBundleSerializer(product_bundle)
        product.delete()
        product_real.delete()
        return Response({"Message": "Success", "data":serializer.data}, status= status.HTTP_202_ACCEPTED)

class DetailProductBundleOfProductView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, id):
        product = Product.objects.get(id=id)
        product_bundle = ProductBundle.objects.get(product=product)
        serializer = ProductBundleSerializer(product_bundle)
        return Response(serializer.data)
    
class DetailProductLineOfProductView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrPartnership]
    def get(self, request, id):
        product = Product.objects.get(id=id)
        serializer = ProductForContractSerializer(product)
        return Response(serializer.data)