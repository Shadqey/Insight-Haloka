from django.urls import path
from .views import *

urlpatterns = [
    path('', ContractView.as_view(), name = 'ContractView'),
    path('client/<slug:client_id>/', ContractListView.as_view(), name='list-contract-client'),
    path('<uuid:id>/delete', DeleteContractView.as_view(), name="delete-contract"),
    path('contract-detail/<uuid:id>/', DetailContractView.as_view(), name='detail-contract'),
    path('<uuid:id>/detail/product/', DetailContractForInvoiceView.as_view(), name='detail-contract-for-invoice'),
    path('update/<uuid:id>/', UpdateContractProductView.as_view(), name="update-contract"),
    path('viewDocumentPDF/<uuid:id>/', ViewDocumentPDF.as_view(), name='view-MoU'),
    path('downloadDocumentPDF/<uuid:id>/', DownloadDocumentPDF.as_view(), name='download-MoU'),
    path('send/email/<uuid:id>/',EmailView.as_view(),name="send-email"),
    path('sendDocumentPDF/<uuid:id>/', SendDocument.as_view(), name='send-MoU'),
]