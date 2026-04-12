from rest_framework import serializers

from .models import Patient
class PatientSerializer(serializers.ModelSerializer):
    class Meta():
        model = Patient
        fields = [ "age" , "gender" , "severity" , "symptoms" , "is_critical" , "arrival_time"]
