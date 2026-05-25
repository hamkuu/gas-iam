from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from . import views

app_name = "accounts"

urlpatterns = [
    path("", LoginView.as_view(template_name="accounts/login.html"), name="login"),
    path("register/", views.register, name="register"),
    path("profile/", views.profile, name="profile"),
    path("logout/", LogoutView.as_view(next_page="accounts:login"), name="logout"),
]
