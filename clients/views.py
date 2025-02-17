from django.shortcuts import render
from django.http import Http404
from rest_framework import generics, status
from rest_framework.generics import ListAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Client
from .serializers import *
import telegram
import asyncio

class DetailClientView(generics.RetrieveAPIView):
    queryset = Client.objects.all()
    serializer_class = DetailClientSerializer
    lookup_field = 'id'

# class ListClientView(ListAPIView):
#     queryset = Client.objects.all()
#     serializer_class = ListClientSerializer
    
class ListClientView(APIView):
    def get(self, request, format=None):
        clients = Client.objects.all()
        serializer = ListClientSerializer(clients, many=True)
        return Response(serializer.data)
    
class UpdateClientView(APIView):
    def get(self, request, id):
        try:
            return Client.objects.get(pk=id)
        except Client.DoesNotExist:
            raise Http404
        
    def put(self, request, id, format=None):
        if self.request.user.is_authenticated and self.request.user.groups.filter(name__in=["Executive", "Manager", "Partnership"]).exists():
            client = Client.objects.get(pk = id)
            client.company_name = request.data["company_name"]
            client.type = request.data["type"]
            client.phone = request.data["phone"]
            client.save()
            
            serializer = DetailClientSerializer(client)
            return Response(serializer.data)
        
        return Response({"Message": "Doesnt have permission"}, status= 401)
    
class DeleteClientView(APIView):
    def get(self, request, id):
        try:
            return Client.objects.get(pk=id)
        except Client.DoesNotExist:
            raise Http404
    
    def delete(self, request, id, format=None):
        if self.request.user.is_authenticated:
            if self.request.user.groups.filter(name__in=["Executive", "Manager", "Partnership"]).exists():
                client = Client.objects.get(pk = id)
                serializer = DetailClientSerializer(client)
                client.delete()
                return Response({"Message": "Success", "data":serializer.data}, status= status.HTTP_202_ACCEPTED)


class CreateClientView(APIView):
        
    def post(self, request, format=None):
        client = Client()
        client.company_name = request.data["Name"]
        client.type = request.data["Type"]
        client.phone = request.data["Phone"]
        client.email = request.data["Email"]
        client.save()
        async def telegram_bot_notification():
            MESSAGE = "Lead Notification \U0001F64C  \n Company name : {company_name} \n Type: {type} \n Phone: {phone} \n Email: {email}".format(company_name=client.company_name,type=client.type,phone=client.phone,email=client.email)
            TOKEN_BOT ="6048856642:AAF7VDerUhhDs51gk1U0xGz24rm_KDRbERM"
            CHAT_ID = -772880339
            bot = telegram.Bot(token=TOKEN_BOT)
            await bot.send_message(chat_id=CHAT_ID, text=MESSAGE)
        asyncio.run(telegram_bot_notification())
        serializer = DetailClientSerializer(client)
        return Response(serializer.data)