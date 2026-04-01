from django.urls import path
from .views import get_or_create_room,create_group_chat,get_user_groups,get_chat_users

urlpatterns = [
    path('api/chat/get_room/<str:user1_id>/<str:user2_id>/', get_or_create_room, name='get-chat-room'),
    path("api/chat/create_group/", create_group_chat, name="create_group_chat"),
    path("api/chat/user_groups/", get_user_groups, name="get_user_groups"),
    path("api/chat/users/", get_chat_users, name="get_chat_users"),
]
