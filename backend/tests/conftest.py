import pytest
from django.contrib.auth import get_user_model

from accounts.models import Prefecture

User = get_user_model()


@pytest.fixture
def prefecture():
    return Prefecture.objects.create(code=13, name="東京都", name_en="Tokyo")


@pytest.fixture
def user(prefecture):
    return User.objects.create_user(
        username="testuser",
        password="password",
        email="test@example.com",
        pref=prefecture,
    )
