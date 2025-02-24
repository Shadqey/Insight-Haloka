"""halokaproj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header  =  "Haloka CRM | Admin Tool"  
admin.site.site_title  =  "Haloka User Admin"
admin.site.index_title  =  "Haloka User Admin"

admin.site.site_header  =  "Haloka CRM | Admin Tool"  
admin.site.site_title  =  "Haloka User Admin"
admin.site.index_title  =  "Haloka User Admin"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/account/', include('accounts.urls')),
    path('api/client/', include('clients.urls')),
    path('api/product/',include('products.urls')),
    path('api/contract/',include('contracts.urls')),
    path('api/invoice/',include('invoices.urls')),
    # path('api/agreement/',include('agreements.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)