from django.apps import AppConfig


class AccountsConfig(AppConfig):
    name = 'accounts'
# patients/apps.py
class PatientsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'patients' 