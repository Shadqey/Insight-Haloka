from django.urls import include, path
from .views import *

urlpatterns = [
    path('', ProductView.as_view(), name='ProductView'),
    path('product-line/', ProductLineView.as_view(), name='ProductLineView'),
    path('product-line-detail/<uuid:id>/', DetailProductLineView.as_view(), name='DetailProductLineView'),
    path('product-bundle/', ProductBundleView.as_view(), name='ProductBundle'),
    path('product-detail/<uuid:id>/', ProductBundleObjectView.as_view(), name='ProductDetail'),
    path('product-bundle-line-get/<uuid:id>/', ProductBundleLineView.as_view(), name='PBLUsingPB'),
    path('product-bundle-get/<uuid:id>/', ProductBundleView.as_view(), name='PBView'),
    path('product-line-delete/<uuid:id>/', DeleteProductLineView.as_view(), name="DeleteProductLine"),
    path('product-line-update/<uuid:id>/', UpdateProductLineView.as_view(), name="UpdateProductLine"),
    path('product-delete/<uuid:id>/', DeleteProductView.as_view(), name="DeleteProduct"),
    path('product-bundle/product-id/<uuid:id>/', DetailProductBundleOfProductView.as_view(), name='detail-product-bundle'),
    path('product-line/product-id/<uuid:id>/', DetailProductLineOfProductView.as_view(), name='detail-product-line'),
    # path('list-product-line/', ListProductView.as_view(), name='ListProductView'),
] 

