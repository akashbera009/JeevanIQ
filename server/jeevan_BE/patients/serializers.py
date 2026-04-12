from rest_framework import serializers

from accounts.models import User
from .models import Patient
class PatientSerializer(serializers.ModelSerializer):
    class Meta():
        model = Patient
        fields = [ "age" , "gender" , "severity" , "symptoms" , "is_critical" , "arrival_time"]

class UserSerializer(serializers.ModelSerializer):
    class Meta():
        model = User
        fields = ["username" , "password"]