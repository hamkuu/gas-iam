from django.db import models


class Prefecture(models.Model):
    code = models.PositiveSmallIntegerField(unique=True)
    name = models.CharField(max_length=10)
    name_en = models.CharField(max_length=50)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return self.name
