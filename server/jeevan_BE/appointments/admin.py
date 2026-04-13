from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'hospital','date_time', 'status')
    list_filter = ('status', 'date_time')
    search_fields = ('patient__user__username', 'doctor__user__username')
