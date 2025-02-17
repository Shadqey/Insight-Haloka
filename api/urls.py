from django.urls import path
from . import views
from .views import *

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path('', views.getRoutes), 
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-data/<int:id>', get_user_data, name='user-data'),
    path('detail/<int:id>/', DetailUserView.as_view(), name='detail-user'),

    # path('user/', get_user_data)
]
