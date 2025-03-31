from django.http import JsonResponse
from rest_framework import generics, permissions, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from django.db.models import Count
from .models import File, User, UserAddress
from .serializers import (
    FileSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer,
    UserAddressSerializer,
)


def home(request):
    return JsonResponse({"message": "Welcome to the API!"})


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class FileUploadView(generics.CreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter queryset based on user role or request type"""
        if self.action == "list":
            # Return all files for admin users
            return File.objects.all()
        return super().get_queryset()

    @action(detail=False, methods=["get"], url_path="me")
    def my_files(self, request):
        """Retrieve files for the currently logged-in user at `/api/files/me/`"""
        user_files = File.objects.filter(user=request.user)
        serializer = self.get_serializer(user_files, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Retrieve files for a specific user at `/api/files/{user_id}/`"""
        user_files = File.objects.filter(user_id=pk)
        serializer = self.get_serializer(user_files, many=True)
        return Response(serializer.data)


class UserViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Return the authenticated user's details at `/api/users/`"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Return user by ID at `/api/users/{id}/`"""
        if pk is None:
            return Response({"error": "User ID required"}, status=400)

        user = User.objects.filter(id=pk).first()
        if not user:
            return Response({"error": "User not found"}, status=404)

        serializer = UserSerializer(user)
        return Response(serializer.data)


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Profile updated successfully", "user": serializer.data}
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserAddressViewSet(viewsets.ModelViewSet):
    serializer_class = UserAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        address = self.get_object()
        if address.user != request.user:
            return Response(
                {"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN
            )

        address.delete()
        return Response(
            {"message": "Address deleted"}, status=status.HTTP_204_NO_CONTENT
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Total files uploaded
        total_files = File.objects.count()

        # Breakdown by file type
        file_types = File.objects.values("file_extension").annotate(count=Count("file"))

        # Get number of files uploaded by each user
        user_file_counts = File.objects.values("user__username").annotate(
            count=Count("id")
        )

        return Response(
            {
                "total_files": total_files,
                "file_types": file_types,
                "user_file_counts": user_file_counts,
            }
        )
