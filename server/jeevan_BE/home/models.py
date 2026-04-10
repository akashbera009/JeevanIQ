from django.db import models
from django.contrib.auth.models import AbstractUser


# -------------------------
# Custom User (for roles)
# -------------------------
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('staff', 'Staff'),
        ('patient', 'Patient'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)


# -------------------------
# Hospital Model
# -------------------------
class Hospital(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


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


# -------------------------
# Patient Model
# -------------------------
class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='patients')

    age = models.IntegerField()
    gender = models.CharField(max_length=10)

    # 🔥 Important for your smart system
    severity = models.IntegerField(help_text="1 (low) - 5 (critical)")
    symptoms = models.TextField()

    is_critical = models.BooleanField(default=False)

    arrival_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username