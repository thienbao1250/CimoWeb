from django.urls import path
from .views import SoBlogViewSet

urlpatterns = [
    path('', SoBlogViewSet.as_view({'get': 'list', 'post': 'create'}), name='blog-list'),
    path('<uuid:id>/', SoBlogViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='blog-detail'),
]