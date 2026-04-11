from django.urls import path
from . import views 

app_name = 'home'
urlpatterns = [
    path('all-patients', views.patients , name='home' ),
    path('doctors-all', views.doctors , name='api_all' )
]