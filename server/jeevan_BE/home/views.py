from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
# from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from .models import Patient
from .serializers import PatientSerializer
# Create your views here.
def doctors(request):
    return HttpResponse("doctors' list ")


class PatientsAPIView(ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer