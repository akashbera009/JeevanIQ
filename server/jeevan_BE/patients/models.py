from django.db import models
from accounts.models import User

# -------------------------
# Patient Model
# -------------------------
class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    hospital = models.ForeignKey('hospitals.Hospital', on_delete=models.CASCADE, related_name='patients')

    age = models.IntegerField()
    gender = models.CharField(max_length=10)

    # 🔥 Important for your smart system
    severity = models.IntegerField(help_text="1 (low) - 5 (critical)")
    symptoms = models.TextField()

    is_critical = models.BooleanField(default=False)

    arrival_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = "Patient"
        verbose_name_plural = "All Patients" 