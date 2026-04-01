from django.urls import path, include
from .views import SoParentAPI,LoginParentAPI,SendOtpAPI,VerifyOtpAPI,SoParentViewSet,process_leave_request
from rest_framework.routers import DefaultRouter

DefaultRouter = DefaultRouter()
DefaultRouter.register(r'so_parent', SoParentViewSet)

urlpatterns = [
    path('/', SoParentAPI.as_view(), name='so_parent'),
    # path('/', include(DefaultRouter.urls)),
    path('<id>', SoParentAPI.as_view(), name='so_parent_detail'),
    path('/login', LoginParentAPI.as_view(), name='api_login'),
    path('/send-otp', SendOtpAPI.as_view(), name='api_send_otp'),
    path('/verify-otp', VerifyOtpAPI.as_view(), name='api_verify_otp'),
    path('/process-leave-request',process_leave_request.as_view(),name='process_leave_request')
]