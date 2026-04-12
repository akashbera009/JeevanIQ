from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView

from .models import Patient
from .serializers import PatientSerializer
from rest_framework.authtoken.models import Token

# Create your views here.
def doctors(request):
    return HttpResponse("doctors' list ")

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

# class PatientsAPIView(ListAPIView):
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated]

#     queryset = Patient.objects.all()
#     serializer_class = PatientSerializer

# get patient list 
class PatientsAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self , request):
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients , many = True)
        return HttpResponse(serializer.data)
    
# get individual patient details 
class ViewPatientDetails(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self , request):
        print('requested user is: ' , request.user , 'token: ' ,request.auth)
        user = Patient.objects.get(username = request.user)
        print(user)
        return HttpResponse('all goddd just cheking ')
    