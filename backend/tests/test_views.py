import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()

REGISTER_URL = reverse("accounts:register")
PROFILE_URL = reverse("accounts:profile")
LOGIN_URL = reverse("accounts:login")


@pytest.fixture
def valid_payload(prefecture):
    return {
        "username": "newuser",
        "email": "newuser@example.com",
        "password1": "Secure123",
        "password2": "Secure123",
        "tel": "09012345678",
        "pref": prefecture.pk,
    }


@pytest.mark.django_db
class TestRegisterView:
    def test_get_renders_form(self, client):
        response = client.get(REGISTER_URL)
        assert response.status_code == 200
        assert "form" in response.context

    def test_post_valid_creates_user(self, client, valid_payload):
        client.post(REGISTER_URL, valid_payload)
        assert User.objects.filter(username="newuser").exists()

    def test_post_valid_logs_in_user(self, client, valid_payload):
        client.post(REGISTER_URL, valid_payload)
        assert "_auth_user_id" in client.session

    def test_post_valid_redirects_to_profile(self, client, valid_payload):
        response = client.post(REGISTER_URL, valid_payload)
        assert response.status_code == 302
        assert response["Location"] == PROFILE_URL

    def test_post_invalid_renders_form_with_errors(self, client, valid_payload):
        valid_payload["username"] = "ab"
        response = client.post(REGISTER_URL, valid_payload)
        assert response.status_code == 200
        assert response.context["form"].errors


@pytest.mark.django_db
class TestProfileView:
    def test_redirects_when_not_logged_in(self, client):
        response = client.get(PROFILE_URL)
        assert response.status_code == 302
        assert response["Location"].startswith(LOGIN_URL)

    def test_accessible_when_logged_in(self, client, user):
        client.force_login(user)
        response = client.get(PROFILE_URL)
        assert response.status_code == 200
