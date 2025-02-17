from django.shortcuts import render
from rest_framework import generics
from .models import HalokaUser
from .serializers import DetailUserSerializer
# Create your views here.
class DetailUserView(generics.RetrieveAPIView):
    queryset = HalokaUser.objects.all()
    serializer_class = DetailUserSerializer
    lookup_field = 'id'