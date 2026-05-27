import pytest
from django.contrib.auth import get_user_model

from accounts.models import Prefecture

User = get_user_model()


@pytest.fixture
def prefecture():
    return Prefecture.objects.get(code=13)  # Tokyo


@pytest.fixture
def user(prefecture):
    return User.objects.create_user(
        username="testuser",
        password="password",
        email="test@example.com",
        pref=prefecture,
    )
