from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.validators import RegexValidator

from .models import Prefecture, User


tel_validator = RegexValidator(
    regex=r"^\d+$",
    message="Enter a valid phone number (digits only).",
)


pass_validator = RegexValidator(
    regex=r"(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}",
    message="Must have at least 8 chars, one uppercase, one lowercase, and one digit.",
)


class UserRegistrationForm(UserCreationForm):
    username = forms.CharField(min_length=3, max_length=100)
    email = forms.EmailField()
    password1 = forms.CharField(widget=forms.PasswordInput, validators=[pass_validator])
    tel = forms.CharField(max_length=20, validators=[tel_validator])
    pref = forms.ModelChoiceField(queryset=Prefecture.objects.all())

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2", "tel", "pref")

    def clean_email(self):
        email = self.cleaned_data["email"]
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email address is already registered.")
        return email
