from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterUserAPI,LoginUserAPI,SoRoleViewSet,LogOutAPI,CheckTokenAPI,SoUserAPI
from rest_framework.authtoken.views import obtain_auth_token

DefaultRouter = DefaultRouter()
DefaultRouter.register(r'roles', SoRoleViewSet)
DefaultRouter.register(r'', SoUserAPI) # SoUserAPI is a viewset



urlpatterns = [
    # path('', include(quan_ly.urls)),
    path('/token-auth', obtain_auth_token, name='api_token_auth'),
    path('/register', RegisterUserAPI.as_view(), name='api_register'),
    path('/login', LoginUserAPI.as_view(), name='api_login'),
    path('/', include(DefaultRouter.urls)),
    path('/logout', LogOutAPI.as_view(), name='api_logout'),
    path('/check-token', CheckTokenAPI.as_view(), name='api_check_token'),
    # path('/getAll',SoUserAPI.as_view(),name='api_get_all_users'),
    # path('/',include(DefaultRouter.urls))
]
