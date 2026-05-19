from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'github_username', 'website', 'location']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({'username': 'This username is already taken.'})
        email = (attrs.get('email') or '').strip()
        if email and User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({'email': 'This email is already registered.'})
        return attrs

    def create(self, validated_data):
        # UserProfile is created by accounts.signals.create_user_profile on post_save
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'profile']
        read_only_fields = ['id', 'username', 'date_joined']


class ProfileUpdateSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(required=False, allow_blank=True)
    github_username = serializers.CharField(required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'bio', 'github_username', 'website', 'location']

    def update(self, instance, validated_data):
        profile_fields = ['bio', 'github_username', 'website', 'location']
        profile_data = {k: validated_data.pop(k) for k in profile_fields if k in validated_data}

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if profile_data:
            profile, _ = UserProfile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance
