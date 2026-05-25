from django.contrib.auth.forms import UserCreationForm

from .models import Prefecture, User


class UserRegistrationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2", "tel", "pref")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["email"].required = True
        self.fields["pref"].queryset = Prefecture.objects.all()
        self.fields["pref"].empty_label = "--- Select prefecture ---"
