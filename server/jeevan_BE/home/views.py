from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.
def doctors(request):
    return HttpResponse("doctors' list ")


def patients(request):
    return HttpResponse("will return patient list ")