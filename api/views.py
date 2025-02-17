from django.shortcuts import render
from django.http.response import JsonResponse, HttpResponse
from django.core import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import Group
from accounts.models import HalokaUser
from accounts.serializers import *
from rest_framework import generics

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['name'] = user.name
        token['group'] = list(user.groups.values_list('name', flat=True))

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        'api/token/refresh',
    ]

    return Response(routes)

@api_view(['GET'])
def getRole(request,id):
    obj = Group.objects.filter(user=id)
    data = serializers.serialize("json",obj)
    return Response(data)

@api_view(['GET'])
def get_user_data(request):
    if request.user.groups.filter(name="Partnership").all:
        obj = HalokaUser.objects.filter(id=request.user.id)
        data = UserSerializer(obj)
        return Response(data)
    return Response({'error': 'not authenticated'}, status = 400)

class DetailUserView(generics.RetrieveAPIView):
    queryset = HalokaUser.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'