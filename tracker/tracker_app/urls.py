from django.urls import path, include
from django.conf.urls import url
from .views import LoginResponse, index, login_redirect
app_name='tracker_app'
urlpatterns = [
    path('dashboard/', index),
    path('login/', login_redirect),
    path('api-auth/', include('rest_framework.urls')),
    path('token/', LoginResponse)
]
