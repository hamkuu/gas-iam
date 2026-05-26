import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()

REGISTER_URL = reverse("accounts:register")
PROFILE_URL = reverse("accounts:profile")
LOGIN_URL = reverse("accounts:login")
API_REGISTER_URL = reverse("accounts:api_register")


@pytest.fixture
def valid_form_payload(prefecture):
    return {
        "username": "newuser",
        "email": "newuser@example.com",
        "password1": "Secure123",
        "password2": "Secure123",
        "tel": "09012345678",
        "pref": prefecture.pk,
    }


@pytest.fixture
def valid_api_payload(prefecture):
    return {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "Secure123",
        "tel": "09012345678",
        "pref": prefecture.pk,
    }


@pytest.mark.django_db
class TestRegisterView:
    def test_get_renders_form(self, client):
        res = client.get(REGISTER_URL)
        assert res.status_code == 200
        assert "form" in res.context

    def test_post_valid_creates_user(self, client, valid_form_payload):
        client.post(REGISTER_URL, valid_form_payload)
        assert User.objects.filter(username="newuser").exists()

    def test_post_valid_logs_in_user(self, client, valid_form_payload):
        client.post(REGISTER_URL, valid_form_payload)
        assert "_auth_user_id" in client.session

    def test_post_valid_redirects_to_profile(self, client, valid_form_payload):
        res = client.post(REGISTER_URL, valid_form_payload)
        assert res.status_code == 302
        assert res["Location"] == PROFILE_URL

    def test_post_invalid_renders_form_with_errors(self, client, valid_form_payload):
        valid_form_payload["username"] = "ab"
        res = client.post(REGISTER_URL, valid_form_payload)
        assert res.status_code == 200
        assert res.context["form"].errors


@pytest.mark.django_db
class TestProfileView:
    def test_redirects_when_not_logged_in(self, client):
        res = client.get(PROFILE_URL)
        assert res.status_code == 302
        assert res["Location"].startswith(LOGIN_URL)

    def test_accessible_when_logged_in(self, client, user):
        client.force_login(user)
        res = client.get(PROFILE_URL)
        assert res.status_code == 200


@pytest.mark.django_db
class TestRegisterAPIView:
    def post(self, client, payload):
        return client.post(API_REGISTER_URL, payload, content_type="application/json")

    def test_register_success(self, client, valid_api_payload):
        res = self.post(client, valid_api_payload)
        assert res.status_code == 201

    def test_register_creates_user(self, client, valid_api_payload):
        self.post(client, valid_api_payload)
        assert User.objects.filter(username="newuser").exists()

    def test_register_password_is_hashed(self, client, valid_api_payload):
        self.post(client, valid_api_payload)
        user = User.objects.get(username="newuser")
        assert user.check_password("Secure123")

    def test_register_res_excludes_password(self, client, valid_api_payload):
        res = self.post(client, valid_api_payload)
        assert "password" not in res.json()

    # username
    def test_username_too_short(self, client, valid_api_payload):
        valid_api_payload["username"] = "ab"
        res = self.post(client, valid_api_payload)
        assert res.status_code == 400
        assert "username" in res.json()

    def test_username_missing(self, client, valid_api_payload):
        del valid_api_payload["username"]
        res = self.post(client, valid_api_payload)
        assert res.status_code == 400
        assert "username" in res.json()

    # email
    def test_email_invalid(self, client, valid_api_payload):
        valid_api_payload["email"] = "not-an-email"
        res = self.post(client, valid_api_payload)
        assert res.status_code == 400
        assert "email" in res.json()

    def test_email_missing(self, client, valid_api_payload):
        del valid_api_payload["email"]
        res = self.post(client, valid_api_payload)
        assert res.status_code == 400
        assert "email" in res.json()

    # password
    def test_password_missing(self, client, valid_api_payload):
        del valid_api_payload["password"]
        res = self.post(client, valid_api_payload)
        assert res.status_code == 400
        assert "password" in res.json()

    def test_password_too_weak(self, client, valid_api_payload):
        valid_api_payload["password"] = "alllower1"
        res = self.post(client, valid_api_payload)
        assert res.status_code == 400
        assert "password" in res.json()

    # tel
    def test_tel_non_digits(self, client, valid_api_payload):
        valid_api_payload["tel"] = "090-1234-5678"
        res = self.post(client, valid_api_payload)
        assert res.status_code == 400
        assert "tel" in res.json()

    def test_tel_missing(self, client, valid_api_payload):
        del valid_api_payload["tel"]
        res = self.post(client, valid_api_payload)
        assert res.status_code == 400
        assert "tel" in res.json()

    # pref
    def test_pref_invalid_id(self, client, valid_api_payload):
        valid_api_payload["pref"] = 9999
        res = self.post(client, valid_api_payload)
        assert res.status_code == 400
        assert "pref" in res.json()

    def test_pref_missing(self, client, valid_api_payload):
        del valid_api_payload["pref"]
        res = self.post(client, valid_api_payload)
        assert res.status_code == 400
        assert "pref" in res.json()
