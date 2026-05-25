import pytest

from accounts.forms import UserRegistrationForm


@pytest.fixture
def valid_data(prefecture):
    return {
        "username": "hiro",
        "email": "hiro@example.com",
        "password1": "Str0ng!Pass",
        "password2": "Str0ng!Pass",
        "tel": "0901234567",
        "pref": prefecture.pk,
    }


@pytest.mark.django_db
class TestUserRegistrationForm:

    # --- valid ---

    def test_valid_form(self, valid_data):
        form = UserRegistrationForm(data=valid_data)
        assert form.is_valid(), form.errors

    # --- username ---

    def test_username_too_short(self, valid_data):
        valid_data["username"] = "ab"
        form = UserRegistrationForm(data=valid_data)
        assert not form.is_valid()
        assert "username" in form.errors

    def test_username_too_long(self, valid_data):
        valid_data["username"] = "a" * 101
        form = UserRegistrationForm(data=valid_data)
        assert not form.is_valid()
        assert "username" in form.errors

    def test_username_required(self, valid_data):
        valid_data["username"] = ""
        form = UserRegistrationForm(data=valid_data)
        assert not form.is_valid()
        assert "username" in form.errors

    # --- email ---

    def test_email_invalid_format(self, valid_data):
        valid_data["email"] = "not-an-email"
        form = UserRegistrationForm(data=valid_data)
        assert not form.is_valid()
        assert "email" in form.errors

    def test_email_required(self, valid_data):
        valid_data["email"] = ""
        form = UserRegistrationForm(data=valid_data)
        assert not form.is_valid()
        assert "email" in form.errors

    def test_email_duplicate(self, valid_data, user):
        valid_data["email"] = user.email
        form = UserRegistrationForm(data=valid_data)
        assert not form.is_valid()
        assert "email" in form.errors

    # --- password ---

    def test_password_mismatch(self, valid_data):
        valid_data["password2"] = "DifferentPass1!"
        form = UserRegistrationForm(data=valid_data)
        assert not form.is_valid()
        assert "password2" in form.errors

    def test_password_required(self, valid_data):
        valid_data["password1"] = ""
        valid_data["password2"] = ""
        form = UserRegistrationForm(data=valid_data)
        assert not form.is_valid()
        assert "password1" in form.errors

    # --- tel ---

    def test_tel_digits_only(self, valid_data):
        valid_data["tel"] = "090-1234-5678"
        form = UserRegistrationForm(data=valid_data)
        assert not form.is_valid()
        assert "tel" in form.errors

    def test_tel_no_letters(self, valid_data):
        valid_data["tel"] = "090abc"
        form = UserRegistrationForm(data=valid_data)
        assert not form.is_valid()
        assert "tel" in form.errors

    def test_tel_required(self, valid_data):
        valid_data["tel"] = ""
        form = UserRegistrationForm(data=valid_data)
        assert not form.is_valid()
        assert "tel" in form.errors

    # --- pref ---

    def test_pref_invalid_choice(self, valid_data):
        valid_data["pref"] = 9999
        form = UserRegistrationForm(data=valid_data)
        assert not form.is_valid()
        assert "pref" in form.errors

    def test_pref_required(self, valid_data):
        valid_data["pref"] = ""
        form = UserRegistrationForm(data=valid_data)
        assert not form.is_valid()
        assert "pref" in form.errors
