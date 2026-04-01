# import json
# from datetime import datetime
# from channels.generic.websocket import AsyncWebsocketConsumer
# import pymongo

# # Kết nối MongoDB
# mongo_client = pymongo.MongoClient("mongodb://localhost:27017")
# chat_db = mongo_client["chat_db"]
# chat_groups_collection = chat_db["chat_groups"]

# class GroupChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         """Xử lý khi user kết nối vào nhóm"""
#         self.group_id = self.scope['url_route']['kwargs']['group_name']
#         self.user_id = self.scope['query_string'].decode().split("=")[-1]  # Lấy user_id từ URL
#         self.group_room_name = f'group_{self.group_id}'

#         # Thêm user vào nhóm WebSocket
#         await self.channel_layer.group_add(
#             self.group_room_name,
#             self.channel_name
#         )
#         await self.accept()

#         # Gửi tin nhắn cũ về cho user mới vào nhóm
#         group_data = chat_groups_collection.find_one({"group_id": self.group_id})
#         if group_data and "messages" in group_data:
#             for msg in group_data["messages"]:
#                 if "timestamp" in msg and isinstance(msg["timestamp"], datetime):
#                     msg["timestamp"] = msg["timestamp"].isoformat()

#             await self.send(text_data=json.dumps({
#                 "type": "load_old_messages",
#                 "messages": group_data["messages"]
#             }))

#     async def receive(self, text_data):
#         """Nhận tin nhắn từ user và gửi tới tất cả thành viên trong nhóm"""
#         data = json.loads(text_data)
#         message = data['message']
#         sender_id = data['sender_id']
#         sender_role = data['sender_role']

#         # Lưu tin nhắn vào MongoDB
#         new_message = {
#             "sender_id": sender_id,
#             "sender_role": sender_role,
#             "message": message,
#             "timestamp": datetime.utcnow().isoformat()
#         }
#         chat_groups_collection.update_one(
#             {"group_id": self.group_id},
#             {"$push": {"messages": new_message}},
#             upsert=True
#         )

#         # Gửi tin nhắn đến tất cả thành viên trong nhóm
#         await self.channel_layer.group_send(
#             self.group_room_name,
#             {
#                 "type": "group_chat_message",
#                 "message": message,
#                 "sender_id": sender_id,
#                 "sender_role": sender_role,
#                 "timestamp": new_message["timestamp"]
#             }
#         )

#     async def group_chat_message(self, event):
#         """Gửi tin nhắn tới tất cả user trong nhóm"""
#         await self.send(text_data=json.dumps({
#             "message": event["message"],
#             "sender_id": event["sender_id"],
#             "sender_role": event["sender_role"],
#             "timestamp": event["timestamp"]
#         }))




import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
import pymongo

# Kết nối MongoDB
mongo_client = pymongo.MongoClient("mongodb://localhost:27017")
chat_db = mongo_client["chat_db"]
chat_groups_collection = chat_db["chat_groups"]

class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Xử lý khi user kết nối vào nhóm"""
        self.group_id = self.scope['url_route']['kwargs']['group_name']
        self.user_id = self.scope['query_string'].decode().split("=")[-1]  # Lấy user_id từ URL
        self.group_room_name = f'group_{self.group_id}'

        # Kiểm tra xem user có thuộc nhóm không
        group = chat_groups_collection.find_one({"group_id": self.group_id})
        if not group or self.user_id not in group["members"]:
            await self.close()
            return

        # Thêm user vào nhóm WebSocket
        await self.channel_layer.group_add(
            self.group_room_name,
            self.channel_name
        )
        await self.accept()

        # Lấy lịch sử tin nhắn và gửi về cho user mới kết nối
        messages = group.get("messages", [])
        for msg in messages:
            if "timestamp" in msg and isinstance(msg["timestamp"], datetime):
                msg["timestamp"] = msg["timestamp"].isoformat()

        await self.send(text_data=json.dumps({
            "type": "load_old_messages",
            "messages": messages
        }))

    async def receive(self, text_data):
        """Nhận tin nhắn từ user và gửi tới tất cả thành viên trong nhóm"""
        data = json.loads(text_data)
        message = data['message']
        sender_id = data['sender_id']

        # Lưu tin nhắn vào MongoDB
        new_message = {
            "sender_id": sender_id,
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        }
        chat_groups_collection.update_one(
            {"group_id": self.group_id},
            {"$push": {"messages": new_message}}
        )

        # Gửi tin nhắn đến tất cả thành viên trong nhóm
        await self.channel_layer.group_send(
            self.group_room_name,
            {
                "type": "group_chat_message",
                "message": message,
                "sender_id": sender_id,
                "timestamp": new_message["timestamp"]
            }
        )

    async def group_chat_message(self, event):
        """Gửi tin nhắn tới tất cả user trong nhóm"""
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender_id": event["sender_id"],
            "timestamp": event["timestamp"]
        }))

from channels.generic.websocket import AsyncWebsocketConsumer
import json

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """WebSocket để lắng nghe sự kiện tạo nhóm mới"""
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.notification_room = f'notifications_{self.user_id}'

        # Thêm user vào nhóm thông báo
        await self.channel_layer.group_add(
            self.notification_room,
            self.channel_name
        )
        await self.accept()

        print(f"🔔 WebSocket thông báo đã kết nối với {self.notification_room}")

    async def disconnect(self, close_code):
        """Ngắt kết nối WebSocket"""
        await self.channel_layer.group_discard(
            self.notification_room,
            self.channel_name
        )
        print(f"❌ WebSocket thông báo đã đóng cho {self.notification_room}")

    async def new_group_notification(self, event):
        """Gửi thông báo nhóm mới đến user"""
        await self.send(text_data=json.dumps({
            "type": "new_group",
            "group_id": event["group_id"]
        }))


# import json
# from datetime import datetime
# from channels.generic.websocket import AsyncWebsocketConsumer
# import pymongo

# # Kết nối MongoDB
# mongo_client = pymongo.MongoClient("mongodb://localhost:27017")
# chat_db = mongo_client["chat_db"]
# chat_groups_collection = chat_db["chat_groups"]

# class GroupChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         """Xử lý khi user kết nối vào nhóm"""
#         self.group_id = self.scope['url_route']['kwargs']['group_name']
#         self.user_id = self.scope['query_string'].decode().split("=")[-1]  # Lấy user_id từ URL
#         self.group_room_name = f'group_{self.group_id}'

#         # Kiểm tra xem user có thuộc nhóm không
#         group = chat_groups_collection.find_one({"group_id": self.group_id})
#         if not group or self.user_id not in group["members"]:
#             await self.close()
#             return

#         # Thêm user vào nhóm WebSocket
#         await self.channel_layer.group_add(
#             self.group_room_name,
#             self.channel_name
#         )
#         await self.accept()

#         # Lấy lịch sử tin nhắn và gửi về cho user mới kết nối
#         messages = group.get("messages", [])
#         for msg in messages:
#             if "timestamp" in msg and isinstance(msg["timestamp"], datetime):
#                 msg["timestamp"] = msg["timestamp"].isoformat()

#         await self.send(text_data=json.dumps({
#             "type": "load_old_messages",
#             "messages": messages
#         }))

#     async def receive(self, text_data):
#         """Nhận tin nhắn từ user và gửi tới tất cả thành viên trong nhóm"""
#         data = json.loads(text_data)
#         message = data['message']
#         sender_id = data['sender_id']

#         # Lưu tin nhắn vào MongoDB
#         new_message = {
#             "sender_id": sender_id,
#             "message": message,
#             "timestamp": datetime.utcnow().isoformat()
#         }
#         chat_groups_collection.update_one(
#             {"group_id": self.group_id},
#             {"$push": {"messages": new_message}}
#         )

#         # Gửi tin nhắn đến tất cả thành viên trong nhóm
#         await self.channel_layer.group_send(
#             self.group_room_name,
#             {
#                 "type": "group_chat_message",
#                 "message": message,
#                 "sender_id": sender_id,
#                 "timestamp": new_message["timestamp"]
#             }
#         )

#     async def group_chat_message(self, event):
#         """Gửi tin nhắn tới tất cả user trong nhóm"""
#         await self.send(text_data=json.dumps({
#             "message": event["message"],
#             "sender_id": event["sender_id"],
#             "timestamp": event["timestamp"]
#         }))
