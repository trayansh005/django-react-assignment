from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter
from .views import (
    FileUploadView,
    RegisterView,
    UserViewSet,
    home,
    CustomTokenObtainPairView,
    UpdateProfileView,
    UserAddressViewSet,
    FileViewSet,
    DashboardView,
)

router = DefaultRouter()
router.register(r"addresses", UserAddressViewSet, basename="user-address")
router.register(r"users", UserViewSet, basename="user")
router.register(r"files", FileViewSet, basename="file")

urlpatterns = [
    # Authentication endpoints
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterView.as_view(), name="register"),
    # File operations
    path("upload/", FileUploadView.as_view(), name="file-upload"),
    path("profile/update/", UpdateProfileView.as_view(), name="update-profile"),
    # Home page
    path("", home, name="home"),
    path("", include(router.urls)),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
]
