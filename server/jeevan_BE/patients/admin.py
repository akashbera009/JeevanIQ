from django.contrib import admin
from patients.models import Patient
from accounts.models import User

class PatientAdmin(admin.ModelAdmin):
    list_display = ["user", "gender", "age", "severity" ,"is_critical" ]

    fieldsets = [
        ("Details", {"fields": ["user" ,"hospital" ]}),
        ("Bio", {"fields": ["age" ,"gender" ]}),
        ("Imps", {"fields": ["is_critical" , "severity" ,"symptoms"]}),
    ]
    list_filter = ["severity"]
    search_fields = ["user__username","hospital__name", "symptoms"]

admin.site.register(Patient , PatientAdmin)    
admin.site.register(User)