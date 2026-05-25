from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from accounts.models import Prefecture, User


@admin.register(Prefecture)
class PrefectureAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "name_en"]
    ordering = ["code"]


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Additional info", {"fields": ("tel", "pref")}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Additional info", {"fields": ("tel", "pref")}),
    )
