from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SoStudentAPI,SoClassViewSet,AttendanceAPI

DefaultRouter = DefaultRouter()
DefaultRouter.register(r'so_class', SoClassViewSet)

urlpatterns = [
    path('/',include(DefaultRouter.urls)),
    path('/so_student',SoStudentAPI.as_view(),name='so_studens'),
    path('/so_student/<id>/', SoStudentAPI.as_view(), name='so_student_detail'),
    path('/check_in/', AttendanceAPI.as_view(), name='attendance_api'),

    # path('/')
]