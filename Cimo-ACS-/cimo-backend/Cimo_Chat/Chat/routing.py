from django.urls import path
from django.urls import re_path
from .consumers import ChatConsumer
from .group_consumers import GroupChatConsumer ,NotificationConsumer # Import chat nhóm

websocket_urlpatterns = [
    # re_path('ws/chat/<str:room_name>/', ChatConsumer.as_asgi()),
    # re_path(r"ws/chat/(?P<room_name>[\w-]+)/$", ChatConsumer.as_asgi()),  # Chat 2 người
    path('ws/chat/<str:room_name>/', ChatConsumer.as_asgi()),
    path('ws/group_chat/<str:group_name>/', GroupChatConsumer.as_asgi()),  # Chat nhóm
    path('ws/notifications/<str:user_id>/', NotificationConsumer.as_asgi()),  # Thông báo nhóm mới
]
