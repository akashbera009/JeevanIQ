from django.db import models
from accounts.models import User
from hospitals.models import Hospital

# -------------------------
# Doctor Model
# -------------------------
class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='doctors')

    specialization = models.CharField(max_length=100)
    experience_years = models.IntegerField()
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2)

    is_available = models.BooleanField(default=True)
    average_consultation_time = models.IntegerField(help_text="In minutes")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dr. {self.user.username} - {self.specialization}"
