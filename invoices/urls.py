from django.urls import include, path
from .views import *

urlpatterns = [
    path('', InvoiceView.as_view(), name='list-invoices'),
    path('contract/<uuid:id>/', ListInvoiceView.as_view(), name='list-invoices-of-contract'),
    path('detail/<uuid:id>/', DetailInvoiceView.as_view(), name='detail-invoice'),
    path('viewPDF/<uuid:id>/', ViewPDF.as_view(), name='view-invoice'),
    path('downloadPDF/<uuid:id>/', DownloadPDF.as_view(), name='download-invoice'),
    path('cancel/<uuid:id>/', CancelInvoiceView.as_view(), name="cancel-invoice"),
    path('get-contract/', ContractView.as_view(), name='get-contract'),
    path('get-contract-product-of-contract/<uuid:id>/', ContractProductOfContractView.as_view(), name='get-contract-product-of-contract'),
    path('get-product-of-contract-product/<uuid:id>/', ProductOfContractProductView.as_view(), name='get-product-of-contract'),
    path('get-product-bundle-of-product/<uuid:id>/', ProductBundleOfProductView.as_view(), name='get-product-bundle-of-product'),
    path('reports/', ReportsView.as_view(), name='reports')
]