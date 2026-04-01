from django.http import JsonResponse
import pymongo
from django.views.decorators.csrf import csrf_exempt
import json
import uuid
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
# Kết nối MongoDB
mongo_client = pymongo.MongoClient("mongodb://localhost:27017")
chat_db = mongo_client["chat_db"]
chat_rooms_collection = chat_db["chat_rooms"]
chat_groups_collection = chat_db["chat_groups"]

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
# from .models import ChatRoom

@csrf_exempt
def get_or_create_room(request, user1_id, user2_id):
    """Kiểm tra nếu room đã có, trả về; nếu chưa có, tạo mới (MongoDB)"""
    
    # Kiểm tra xem phòng chat đã tồn tại chưa
    room = chat_rooms_collection.find_one({
        "$or": [
            {"user1_id": user1_id, "user2_id": user2_id},
            {"user1_id": user2_id, "user2_id": user1_id}
        ]
    })

    if room:
        return JsonResponse({"room_id": room["room_id"]})

    # Nếu chưa có, tạo phòng mới
    new_room = {
        "room_id": str(uuid.uuid4()),
        "user1_id": user1_id,
        "user2_id": user2_id
    }
    chat_rooms_collection.insert_one(new_room)

    return JsonResponse({"room_id": new_room["room_id"]})




@csrf_exempt
def create_group_chat(request):
    """API tạo nhóm chat mới nếu có từ 3 user trở lên"""
    if request.method == "POST":
        data = json.loads(request.body)
        members = data.get("members")  # Danh sách user

        if len(members) < 3:
            return JsonResponse({"error": "Cần ít nhất 3 người để tạo nhóm"}, status=400)

        group_id = str(uuid.uuid4())  # Tạo group_id ngẫu nhiên

        chat_groups_collection.insert_one({
            "group_id": group_id,
            "members": members,
            "messages": []
        })

        # Gửi thông báo nhóm mới đến các thành viên
        channel_layer = get_channel_layer()
        for user in members:
            async_to_sync(channel_layer.group_send)(
                f"notifications_{user}",
                {
                    "type": "new_group_notification",
                    "group_id": group_id
                }
            )

        return JsonResponse({"group_id": group_id, "message": "Nhóm đã được tạo thành công!"})
    
@csrf_exempt
def get_user_groups(request):
    """API lấy danh sách nhóm mà user đang tham gia"""
    user_id = request.GET.get("user_id")

    if not user_id:
        return JsonResponse({"error": "Thiếu user_id"}, status=400)

    groups = chat_groups_collection.find({"members": user_id})
    group_list = [{"group_id": group["group_id"]} for group in groups]

    return JsonResponse({"groups": group_list})

@csrf_exempt
def get_chat_users(request):
    """API lấy danh sách tất cả user đã từng nhắn tin với mình"""
    user_id = request.GET.get("user_id")

    if not user_id:
        return JsonResponse({"error": "Thiếu user_id"}, status=400)

    chat_users = set()

    # Lấy danh sách các phòng chat mà user này có mặt
    chats = chat_rooms_collection.find({"$or": [{"user1_id": user_id}, {"user2_id": user_id}]})

    for chat in chats:
        if chat["user1_id"] == user_id:
            chat_users.add(chat["user2_id"])
        else:
            chat_users.add(chat["user1_id"])

    return JsonResponse({"users": list(chat_users)})
