from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    team_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.email}'s Profile"
