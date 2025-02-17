from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from .serializers import LayananSerializer
from .models import Layanan

# Create your views here.
def listLayanan(request):
    return HttpResponse('<h1>Hey, Welcome</h1>')


# Create your views here.


class LayananView(generics.ListAPIView):
    queryset = Layanan.objects.all()
    serializer_class = LayananSerializer