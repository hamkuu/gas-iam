import pytest


@pytest.mark.django_db
class TestPrefecture:
    def test_prefecture_created(self, prefecture):
        assert prefecture.pk is not None

    def test_prefecture_fields(self, prefecture):
        assert prefecture.code == 13
        assert prefecture.name == "東京都"
        assert prefecture.name_en == "Tokyo"

    def test_prefecture_str(self, prefecture):
        assert str(prefecture) == "東京都"


@pytest.mark.django_db
class TestUser:
    def test_user_created(self, user):
        assert user.pk is not None

    def test_user_fields(self, user):
        assert user.username == "testuser"
        assert user.email == "test@example.com"

    def test_user_password(self, user):
        assert user.check_password("password")

    def test_user_has_pref(self, user, prefecture):
        assert user.pref == prefecture
