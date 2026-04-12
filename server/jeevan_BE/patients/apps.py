from django.apps import AppConfig

class PatientsConfig(AppConfig):   # rename class (optional but clean)
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'patients' 