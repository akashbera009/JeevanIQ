from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views 

app_name = 'patients'
urlpatterns = [
    path('list/', views.PatientsAPIView.as_view() , name='patients' ),
    path('patients-detail/', views.ViewPatientDetails.as_view() , name='patients-detail' ),
]
urlpatterns = format_suffix_patterns(urlpatterns)