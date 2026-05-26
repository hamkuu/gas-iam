from rest_framework import serializers

from .models import Prefecture, User
from .validators import pass_validator, tel_validator


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
