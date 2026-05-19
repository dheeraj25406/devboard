from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    github_username = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f'{self.user.username} profile'
