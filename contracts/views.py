from django.shortcuts import render
from rest_framework.views import APIView
from contracts.models.contract import Contract
from contracts.models.contract_product import ContractProduct
from products.models.product import Product
from products.models.product_bundle import ProductBundle
from products.models.product_bundle_line import ProductBundleLine
from products.models.product_line import ProductLine
from products.serializers import ProductLineSerializer, ProductSerializer
from .serializers import *
from rest_framework.response import Response
from rest_framework import generics,status
from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.decorators import authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from io import BytesIO
from django.http import HttpResponse
from django.template.loader import get_template
from django.views import View
from xhtml2pdf import pisa
from .serializers import *
from accounts.permissions import *
from django.core.mail import BadHeaderError, send_mail
from contracts.s3 import s3_client

# Create your views here.
class ContractView(APIView):
    
    # permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, pk=None, format=None):
        if pk:
            data = self.get_object(pk)
            serializer = ContractSerializer(data)
        else :
            data = Contract.objects.all()
            serializer = ContractSerializer(data, many=True)
            return Response(serializer.data)

    def post(self, request, format=None):
        # print(request.user.is_authenticated)
        if (request.user.groups.filter(name__in=["Manager", "Partnership"]).exists()):
            data = {"client":request.data['client'], "start_date":request.data['start_date'], "end_date":request.data['end_date'], "status":request.data['status']}
            serializer = CreateContractSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            contract = serializer.save()

            products = request.data['product']
            for dic in products:
                if (("isChecked" in dic) and (dic["isChecked"])):
                    data_p = {"contract": contract.id, "product":dic["id"]}
                    serializer_p = CreateContractProductSerializer(data=data_p)
                    serializer_p.is_valid(raise_exception=True)
                    serializer_p.save()

            response = Response()
            response.data = {
                'message': 'Contract Created Successfully',
                'data': serializer.data
            }

            return response
        return Response({"Message": "Doesnt have permission"}, status= 403)
    
class ContractListView(ListAPIView):
    permission_classes = [IsAuthenticated, IsManagerPartnershipFinance]

    serializer_class = ContractSerializer

    def get_queryset(self):
        client_id = self.kwargs['client_id']
        queryset = Contract.objects.filter(client_id__exact=client_id).order_by('-created_at')
        return queryset
        
class DeleteContractView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrPartnership]

    def get(self, request, id):
        try:
            return Contract.objects.get(pk=id)
        except Contract.DoesNotExist:
            raise Http404
    
    def delete(self, request, id, format=None):
        try:
            # print(id)
            contract = Contract.objects.get(pk=id)
        except Contract.DoesNotExist:
            return Response({"Message": "Contract does not exist"}, status=status.HTTP_404_NOT_FOUND)

        if request.user.is_authenticated:
            if request.user.groups.filter(name__in=["Manager", "Partnership"]).exists():
                if contract.status != 'approved':
                    serializer = ContractSerializer(contract)
                    contract.delete()
                    return Response({"Message": "Success", "data": serializer.data}, status=status.HTTP_202_ACCEPTED)
                else:
                    return Response({"Message": "Approved contract can't be deleted"}, status=status.HTTP_403_FORBIDDEN)

        return Response({"Message": "Doesnt have permission"}, status=status.HTTP_403_FORBIDDEN)
    
class DetailContractView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, IsManagerPartnershipFinance]

    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    lookup_field = 'id'

# Gakepake
# class DetailProductOfContractView(APIView):
#     permission_classes = [IsAuthenticated, IsManagerPartnershipFinance]

#     def get (self, request, id):
#         contract = Contract.objects.get(id=id)
#         contract_product = ContractProduct.objects.filter(contract=contract)
#         product = []
#         for cp in contract_product:
#             product.append(cp.product)
#         serializer = ProductSerializer(product, many=True)
#         return Response(serializer.data)
    
class UpdateContractProductView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrPartnership]
    
    def put(self, request, id, format=None):
        try:
            contract = Contract.objects.get(id=id) 

        except Contract.DoesNotExist:
            return Response({"Message": "Contract does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        contract.start_date = request.data["start_date"]
        contract.end_date = request.data["end_date"]
        contract.status = request.data["status"]

        contract.save()

        existing_products = ContractProduct.objects.filter(contract_id=id)
        existing_product_ids = set(existing_products.values_list('product_id', flat=True))
        existing_product_ids = {str(uuid) for uuid in existing_product_ids}

        product_ids = request.data['product']
        updated_product_ids = set(product_ids)

        products_to_remove = existing_products.exclude(product_id__in=updated_product_ids)
        products_to_remove.delete()

        for product_id in updated_product_ids - existing_product_ids:
            print(product_id)
            data_p = {"contract": contract.id, "product":product_id}
            serializer_p = CreateContractProductSerializer(data=data_p)
            serializer_p.is_valid(raise_exception=True)
            serializer_p.save()
        
        serializer = CreateContractSerializer(contract)
        return Response(serializer.data)
    
class DetailContractForInvoiceView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        contract = Contract.objects.get(id=id)
        serializer = ContractForInvoiceSerializer(contract)
        return Response(serializer.data)


def render_to_pdf(template_src, context_dict={}):
	template = get_template(template_src)
	html  = template.render(context_dict)
	result = BytesIO()
	pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
	if not pdf.err:
		return HttpResponse(result.getvalue(), content_type='application/pdf')
	return None

#Opens up page as PDF
class ViewDocumentPDF(View):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        data = Contract.objects.get(id=id)
        serializer = ContractSerializer(data)
        agreement = serializer.data
        pdf = render_to_pdf('../templates/document.html', agreement)
        return HttpResponse(pdf, content_type='application/pdf')
        # return Response(serializer.data)
                # return Response(serializer.data)


#Automaticly downloads to PDF file
# class DownloadPDF(View):
# 	def get(self, request, *args, **kwargs):
		
# 		pdf = render_to_pdf('document.html', data)

# 		response = HttpResponse(pdf, content_type='application/pdf')
# 		filename = "Invoice_%s.pdf" %("12341231")
# 		content = "attachment; filename='%s'" %(filename)
# 		response['Content-Disposition'] = content
# 		return response


class DownloadDocumentPDF(View):
        
    permission_classes = [IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        data = Contract.objects.get(id=id)
        serializer = ContractSerializer(data)
        agreement = serializer.data
        contract_product = ContractProduct.objects.filter(contract_id=id)
        number = data.number
        total_price = 0
        product_bundle = []
        product_line_all = {}
        product_all = []

        # for p in contract_product.products:
        #     product_bundle = ProductBundle.objects.filter(product=p.product)
        #     total_price += product_bundle.unit_price

        for cp in contract_product:
            product_bundle = ProductBundle.objects.filter(product=cp.product).first()
            if product_bundle:
                total_price += product_bundle.unit_price

        for cp in contract_product:
            product = Product.objects.get(id=cp.product.id)
            product_all.append(product)

        # for p in product_all:
        #     product_bundle = ProductBundle.objects.get(product=p)
        #     product_bundle_line = ProductBundleLine.objects.get(product_bundle=product_bundle)
        #     product_line_all[p.title] = product_bundle_line.product_line
            


        # for pb in contract_product.products:
        #     product_bundle = ProductBundle.object.filter(product=pb)
        #     product_bundle_line = ProductBundleLine.objects.filter(product_bundle=product_bundle)
        #     for pl in product_bundle_line.product_line:
        #         product_line_all.append(pl)

        context = {
            'agreement': agreement,
            'total_price': total_price,
            'product_line_all': product_line_all,
            'contract_product': contract_product,
            'product_all': product_all,
        }

        pdf = render_to_pdf('document.html', context)

        key = f'document-MoU/{str(data.number)}.pdf'

        download_url = s3_client.put_agreement(pdf_file=pdf.getvalue(), key=key)
        data.link_mou = download_url
        data.save()

        response = HttpResponse(pdf, content_type="application/pdf")
        filename = "MoU-%s.pdf" %(data.number)
        content = "attachment; filename=%s" %(filename)
        response['Content-Disposition'] = content
        return response
    
class EmailView(APIView):
    def post(self, request, id, format=None):
        contract = Contract.objects.get(id=id)
        contract_product = ContractProduct.objects.filter(contract_id=id)
        status = contract.status
        number = contract.number

        # TEMPLATE
        subject = ""
        if (status == "draft"):
            subject = "Contract is in Draft!"
        if (status == "in_review"):
            subject = "Contract is in Review!"
        if (status == "approved"):
            subject = "Contract has been Approved!"
        message = f"Greetings, {contract.client.company_name}\n\n"
        message += "Congrats! \nYour contract with Haloka Grup Indonesia has been updated. Here's the detail : \n\n"
        message += ("Number: " + str(contract.number) + " \n")
        message += ("Start date: " + str(contract.start_date) + " \n")
        message += ("End date: " + str(contract.end_date) + " \n")
        message += ("Status: " + str(contract.status) + " \n\n")
        message += ("List of Products: \n")
        for prod in contract_product :
            message += ("- "+ str(prod.product.title) + " \n")
        message += "\n\nBest regrads, \n"
        message += "Haloka Grup Indonesia."

        from_email = "insgiht.haloka@gmail.com"
        to_email = contract.client.email
        if subject and message and from_email:
            try:
                send_mail(subject, message, from_email, [to_email])
                contract.last_email = contract.status
                contract.save()
            except BadHeaderError:
                return HttpResponse("Invalid header found.")
        else:
            # In reality we'd use a form class
            # to get proper validation errors.
            return HttpResponse("Make sure all fields are entered and valid.")
        # Return a valid response object
        return Response({'message': 'Email sent successfully.'})
    def get (self, request, id):
        contract = Contract.objects.get(id=id)
        serializer = ContractSerializer(contract)
        return Response(serializer.data)


class SendDocument(APIView):
    def post(self, request, id, format=None):
        contract = Contract.objects.get(id=id)
        
        subject = f"{contract.client.company_name} MoU Document"
        message = f"Greetings, {contract.client.company_name}\n\n"
        message += f"Here is the link to the document MoU: {contract.link_mou}\n"
        message += "If something is still wrong, please let us know.\n"
        message += "Thank you.\n\n\n"
        message += "Best regards,\nHaloka Grup Indonesia."

        from_email = "insgiht.haloka@gmail.com"
        to_email = contract.client.email

        if subject and message and from_email:
            try:
                send_mail(subject, message, from_email, [to_email])
                return Response({'message': 'Email sent successfully.'})
            except BadHeaderError:
                return HttpResponse("Invalid header found.")
        else:
            return HttpResponse("Make sure all fields are entered and valid.")

    def get(self, request, id):
        contract = Contract.objects.get(id=id)
        serializer = ContractSerializer(contract)
        return Response(serializer.data)
