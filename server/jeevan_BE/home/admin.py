from django.contrib import admin

from home.models import User , Hospital , Doctor , Patient

# Register your models here.
admin.site.register(User)
admin.site.register(Hospital)
admin.site.register(Doctor)
admin.site.register(Patient)    