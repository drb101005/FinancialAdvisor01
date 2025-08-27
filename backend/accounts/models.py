from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    phone_number = models.CharField(max_length=10, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    is_banned = models.BooleanField(default=False)

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    traits = models.JSONField(default=dict)  
    # Example: {"risk_taker": 0.8, "long_term": 0.6, "safe": 0.2}
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
