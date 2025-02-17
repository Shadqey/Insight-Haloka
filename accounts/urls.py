from django.urls import path
from .views import *

urlpatterns = [
    path('detail/<int:id>/', DetailUserView.as_view(), name='detail-user'),
    # path('current_user/', current_user),
    # path('users/', UserList.as_view()),
]
