from django.contrib.auth.models import AbstractUser
from django.db import models


class Prefecture(models.Model):
    code = models.PositiveSmallIntegerField(unique=True)
    name = models.CharField(max_length=10)
    name_en = models.CharField(max_length=50)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return self.name


class User(AbstractUser):
    tel = models.CharField(max_length=20, null=True, blank=True)
    pref = models.ForeignKey(
        "Prefecture",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )
