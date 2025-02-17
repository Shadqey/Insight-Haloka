from django.urls import include, path

from .views import listLayanan, LayananView

urlpatterns = [
    path('list-layanan/',listLayanan,name='listLayanan'),
    path('daftar-layanan/', LayananView.as_view, name='LayananView')
]