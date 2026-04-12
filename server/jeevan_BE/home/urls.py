from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views 

app_name = 'home'
urlpatterns = [
    path('patients/', views.PatientsAPIView.as_view() , name='home' ),
    path('doctors/', views.doctors , name='api_all' )
]
urlpatterns = format_suffix_patterns(urlpatterns)