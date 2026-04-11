from django.contrib import admin

from home.models import User , Hospital , Doctor , Patient


class DoctorAdmin(admin.ModelAdmin):
    list_display = ["user", "specialization", "experience_years", "is_available"]

    fieldsets = [
        (None, {"fields": ["user" ,"hospital"]}),
        ("Specs", {"fields": ["specialization" , "experience_years" , "consultation_fee","average_consultation_time"]}),
    ]
    list_filter = ["experience_years"]
    search_fields = ["user__username" , "hospital__name" , "specialization"]


class PatientAdmin(admin.ModelAdmin):
    list_display = ["user", "gender", "age", "severity" ,"is_critical" ]

    fieldsets = [
        ("Details", {"fields": ["user" ,"hospital" ]}),
        ("Bio", {"fields": ["age" ,"gender" ]}),
        ("Imps", {"fields": ["is_critical" , "severity" ,"symptoms"]}),
    ]
    list_filter = ["severity"]
    search_fields = ["user__username","hospital__name", "symptoms"]

admin.site.register(User)
admin.site.register(Hospital)
admin.site.register(Patient , PatientAdmin)    
admin.site.register(Doctor, DoctorAdmin)