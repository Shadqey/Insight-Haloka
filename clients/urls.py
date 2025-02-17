from django.urls import path
from .views import *

urlpatterns = [
    path('detailClient/<uuid:id>/', DetailClientView.as_view(), name='detail-client'),
    path('', ListClientView.as_view(), name = "list-client"),
    path('<uuid:id>/delete', DeleteClientView.as_view(), name="delete-client"),
    path('<uuid:id>/update', UpdateClientView.as_view(), name="update-client"),
    path('create/', CreateClientView.as_view(), name='create-client'),
]