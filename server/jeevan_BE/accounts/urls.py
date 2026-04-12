from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views 

app_name = 'accounts'
urlpatterns = [
    path('register/' , views.RegisterUser.as_view() , name ='register'),
    path('login/' , views.LoginUser.as_view() , name ='login'),
]