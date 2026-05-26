from django import forms
from django.contrib.auth.forms import UserCreationForm

from .models import Prefecture, User
from .validators import pass_validator, tel_validator


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
