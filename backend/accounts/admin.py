from django.contrib import admin

from accounts.models import Prefecture


@admin.register(Prefecture)
class PrefectureAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "name_en"]
    ordering = ["code"]
