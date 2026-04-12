from django.contrib import admin
from .models import Doctor

class DoctorAdmin(admin.ModelAdmin):
    list_display = ["user", "specialization", "experience_years", "is_available"]

    fieldsets = [
        (None, {"fields": ["user" ,"hospital"]}),
        ("Specs", {"fields": ["specialization" , "experience_years" , "consultation_fee","average_consultation_time"]}),
    ]
    list_filter = ["experience_years"]
    search_fields = ["user__username" , "hospital__name" , "specialization"]

admin.site.register(Doctor, DoctorAdmin)
