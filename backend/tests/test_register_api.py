import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()

REGISTER_URL = reverse("accounts:api_register")


@pytest.fixture
def valid_payload(prefecture):
    return {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "Secure123",
        "tel": "09012345678",
        "pref": prefecture.pk,
    }


@pytest.mark.django_db
class TestRegisterAPIView:
    def test_register_success(self, client, valid_payload):
        response = client.post(
            REGISTER_URL, valid_payload, content_type="application/json"
        )
        assert response.status_code == 201

    def test_register_creates_user(self, client, valid_payload):
        client.post(REGISTER_URL, valid_payload, content_type="application/json")
        assert User.objects.filter(username="newuser").exists()

    def test_register_password_is_hashed(self, client, valid_payload):
        client.post(REGISTER_URL, valid_payload, content_type="application/json")
        user = User.objects.get(username="newuser")
        assert user.check_password("Secure123")

    def test_register_response_excludes_password(self, client, valid_payload):
        response = client.post(
            REGISTER_URL, valid_payload, content_type="application/json"
        )
        assert "password" not in response.json()

    # username
    def test_username_too_short(self, client, valid_payload):
        valid_payload["username"] = "ab"
        response = client.post(
            REGISTER_URL, valid_payload, content_type="application/json"
        )
        assert response.status_code == 400
        assert "username" in response.json()

    def test_username_missing(self, client, valid_payload):
        del valid_payload["username"]
        response = client.post(
            REGISTER_URL, valid_payload, content_type="application/json"
        )
        assert response.status_code == 400
        assert "username" in response.json()

    # email
    def test_email_invalid(self, client, valid_payload):
        valid_payload["email"] = "not-an-email"
        response = client.post(
            REGISTER_URL, valid_payload, content_type="application/json"
        )
        assert response.status_code == 400
        assert "email" in response.json()

    def test_email_missing(self, client, valid_payload):
        del valid_payload["email"]
        response = client.post(
            REGISTER_URL, valid_payload, content_type="application/json"
        )
        assert response.status_code == 400
        assert "email" in response.json()

    # password
    def test_password_missing(self, client, valid_payload):
        del valid_payload["password"]
        response = client.post(
            REGISTER_URL, valid_payload, content_type="application/json"
        )
        assert response.status_code == 400
        assert "password" in response.json()

    def test_password_too_weak(self, client, valid_payload):
        valid_payload["password"] = "alllower1"
        response = client.post(
            REGISTER_URL, valid_payload, content_type="application/json"
        )
        assert response.status_code == 400
        assert "password" in response.json()

    # tel
    def test_tel_non_digits(self, client, valid_payload):
        valid_payload["tel"] = "090-1234-5678"
        response = client.post(
            REGISTER_URL, valid_payload, content_type="application/json"
        )
        assert response.status_code == 400
        assert "tel" in response.json()

    def test_tel_missing(self, client, valid_payload):
        del valid_payload["tel"]
        response = client.post(
            REGISTER_URL, valid_payload, content_type="application/json"
        )
        assert response.status_code == 400
        assert "tel" in response.json()

    # pref
    def test_pref_invalid_id(self, client, valid_payload):
        valid_payload["pref"] = 9999
        response = client.post(
            REGISTER_URL, valid_payload, content_type="application/json"
        )
        assert response.status_code == 400
        assert "pref" in response.json()

    def test_pref_missing(self, client, valid_payload):
        del valid_payload["pref"]
        response = client.post(
            REGISTER_URL, valid_payload, content_type="application/json"
        )
        assert response.status_code == 400
        assert "pref" in response.json()
