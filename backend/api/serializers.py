from rest_framework import serializers
from .models import File, User, UserContact, UserAddress
from rest_framework_simplejwt.tokens import RefreshToken


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["id", "file", "upload_date", "file_extension"]
        read_only_fields = ["id", "upload_date"]


class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = ["id", "address"]


class UserContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserContact
        fields = ["phone"]


class UserSerializer(serializers.ModelSerializer):
    contact = UserContactSerializer(source="usercontact", required=False)
    addresses = UserAddressSerializer(many=True, required=False)

    class Meta:
        model = User
        fields = ["id", "email", "username", "password", "contact", "addresses"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        contact_data = validated_data.pop("usercontact", None)
        addresses_data = validated_data.pop("addresses", [])  # Extract addresses

        user = User.objects.create_user(**validated_data)

        if contact_data:
            UserContact.objects.create(user=user, **contact_data)

        # Create multiple addresses
        for address_data in addresses_data:
            UserAddress.objects.create(user=user, **address_data)

        return user

    def update(self, instance, validated_data):
        contact_data = validated_data.pop("usercontact", None)
        addresses_data = validated_data.pop("addresses", [])


        # Update user fields
        instance.username = validated_data.get("username", instance.username)
        instance.save()

        if contact_data:
            user_contact, _ = UserContact.objects.update_or_create(
                user=instance,
                defaults={"phone": contact_data.get("phone", "")},
            )

        # Update addresses (delete old ones and add new)
        instance.addresses.all().delete()
        for address_data in addresses_data:
            UserAddress.objects.create(user=instance, **address_data)

        return instance


class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        # Fetch user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        # Check if password is correct
        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect password")

        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
            },
        }
