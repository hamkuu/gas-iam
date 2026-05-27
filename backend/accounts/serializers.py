from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer as BaseUserDetailsSerializer

from .models import Prefecture, User
from .validators import pass_validator, tel_validator


class UserDetailsSerializer(BaseUserDetailsSerializer):
    pref = serializers.PrimaryKeyRelatedField(
        queryset=Prefecture.objects.all(), allow_null=True
    )

    class Meta(BaseUserDetailsSerializer.Meta):
        fields = BaseUserDetailsSerializer.Meta.fields + ("tel", "pref")


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(min_length=3)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, validators=[pass_validator])
    tel = serializers.CharField(validators=[tel_validator])
    pref = serializers.PrimaryKeyRelatedField(queryset=Prefecture.objects.all())

    class Meta:
        model = User
        fields = ("username", "email", "password", "tel", "pref")

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
